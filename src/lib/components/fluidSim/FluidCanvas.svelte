<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";
	import * as shaders from "./fluidShader";
	import { generateColor } from "./colourGradient";
	import {
		hashCode,
		scaleByPixelRatio,
	} from "./util";
	import { fade } from "svelte/transition";
	import InteractiveMouse from "./InteractiveMouse.svelte";

	interface Props {
		SIM_RESOLUTION?: number;
		DYE_RESOLUTION?: number;
		INITIAL_DENSITY_DISSIPATION?: number;
		INITIAL_VELOCITY_DISSIPATION?: number;
		DENSITY_DISSIPATION?: number;
		VELOCITY_DISSIPATION?: number;
		PRESSURE?: number;
		PRESSURE_ITERATIONS?: number;
		CURL?: number;
		SPLAT_RADIUS?: number;
		SPLAT_FORCE?: number;
		RANDOM_SPLAT_FORCE?: number;
		SHADING?: boolean;
		PAUSED?: boolean;
		INTERACTIVE?: boolean;
		FPS?: number;
		SPLASH_ON_PRINT?: boolean;
	}

	let {
		SIM_RESOLUTION = 32,
		DYE_RESOLUTION = $bindable(512),
		INITIAL_DENSITY_DISSIPATION = 0.05,
		INITIAL_VELOCITY_DISSIPATION = 0.4,
		DENSITY_DISSIPATION = $bindable(0.05),
		VELOCITY_DISSIPATION = $bindable(0.4),
		PRESSURE = 0.1,
		PRESSURE_ITERATIONS = 20,
		CURL = 15,
		SPLAT_RADIUS = 1,
		SPLAT_FORCE = 500,
		RANDOM_SPLAT_FORCE = 20,
		SHADING = $bindable(true),
		PAUSED = $bindable(false),
		INTERACTIVE = true,
		FPS = $bindable(1),
		SPLASH_ON_PRINT = false
	}: Props = $props();

	let generatedCanvasPrintFrames: string[] | null = $state(null);

	const MAX_STEP_SIZE = 0.016666;

	let eventDispatch = createEventDispatcher();

	function disableInteractive(interactive: boolean) {
		if (interactive) return;

		PAUSED = false;

		pointers.forEach((p) => {
			p.down = false;
		});
	}

	function getSupportedFormat(
		gl: WebGL2RenderingContext,
		internalFormat: number,
		format: number,
		type: number,
	) {
		const texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texImage2D(
			gl.TEXTURE_2D,
			0,
			internalFormat,
			4,
			4,
			0,
			format,
			type,
			null,
		);

		const fbo = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
		gl.framebufferTexture2D(
			gl.FRAMEBUFFER,
			gl.COLOR_ATTACHMENT0,
			gl.TEXTURE_2D,
			texture,
			0,
		);

		const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
		const supportRenderTextureFormat = status == gl.FRAMEBUFFER_COMPLETE;

		if (!supportRenderTextureFormat) {
			switch (internalFormat) {
				case gl.R16F:
					return getSupportedFormat(gl, gl.RG16F, gl.RG, type);
				case gl.RG16F:
					return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
				default:
					return null;
			}
		}

		return {
			internalFormat,
			format,
		};
	}

	const isMobile = () => /Mobi|Android/i.test(navigator.userAgent);

	function createPointer(): PointerInfo {
		return {
			id: -1,
			texcoordX: 0,
			texcoordY: 0,
			prevTexcoordX: 0,
			prevTexcoordY: 0,
			deltaX: 0,
			deltaY: 0,
			down: false,
			moved: false,
			color: { r: 30, g: 0, b: 300 },
		};
	}

	function updatePointerDownData(pointer: PointerInfo, id: number, posX: number, posY: number) {
		pointer.id = id;
		pointer.down = true;
		pointer.moved = false;
		pointer.texcoordX = posX / canvas.width;
		pointer.texcoordY = 1.0 - posY / canvas.height;
		pointer.prevTexcoordX = pointer.texcoordX;
		pointer.prevTexcoordY = pointer.texcoordY;
		pointer.deltaX = 0;
		pointer.deltaY = 0;
		pointer.color = generateColor();
	}

	function updatePointerMoveData(pointer: PointerInfo, posX: number, posY: number) {
		pointer.prevTexcoordX = pointer.texcoordX;
		pointer.prevTexcoordY = pointer.texcoordY;
		pointer.texcoordX = posX / canvas.width;
		pointer.texcoordY = 1.0 - posY / canvas.height;
		const aspectRatio = canvas.width / canvas.height;
		pointer.deltaX = correctDeltaX(
			pointer.texcoordX - pointer.prevTexcoordX,
			aspectRatio,
		);
		pointer.deltaY = correctDeltaY(
			pointer.texcoordY - pointer.prevTexcoordY,
			aspectRatio,
		);
		pointer.moved =
			Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
	}

	const correctDeltaX = (delta: number, aspectRatio: number) =>
		aspectRatio < 1 ? delta * aspectRatio : delta;

	const correctDeltaY = (delta: number, aspectRatio: number) =>
		aspectRatio > 1 ? delta / aspectRatio : delta;

	function createMaterial(vertexShader: WebGLShader, fragmentShaderSource: string) {
		const programs: WebGLProgramMap = {};
		let activeProgram: WebGLProgram | null = null;
		let uniforms: WebGLUniformMap = {};
		return {
			programs,
			get activeProgram() {
				return activeProgram;
			},
			get uniforms() {
				return uniforms;
			},
			setKeywords(keywords: string[]) {
				if (!gl) throw new Error("WebGL context not initialized");

				let hash = 0;
				for (let i = 0; i < keywords.length; i++)
					hash += hashCode(keywords[i]);

				let program = programs[hash];
				if (program == null) {
					const fragmentShader = compileShader(
						gl.FRAGMENT_SHADER,
						fragmentShaderSource,
						keywords,
					);
					program = buildProgram(vertexShader, fragmentShader);
					programs[hash] = program;
				}

				if (program == activeProgram) return;

				uniforms = getUniforms(program);
				activeProgram = program;
			},
			bind() {
				if (!gl) throw new Error("WebGL context not initialized");

				gl.useProgram(activeProgram);
			},
		};
	}

	function createProgram(
		vertexShader: WebGLShader,
		fragmentShader: WebGLShader,
	): ProgramInfo {
		if (!gl) throw new Error("WebGL context not initialized");

		const program = buildProgram(vertexShader, fragmentShader);
		const uniforms = getUniforms(program);
		return {
			program,
			uniforms,
			bind() {
				if (!gl) throw new Error("WebGL context not initialized");
				gl.useProgram(program);
			},
		};
	}

	function buildProgram(
		vertexShader: WebGLShader,
		fragmentShader: WebGLShader,
	) {
		if (!gl) throw new Error("WebGL context not initialized");

		const program: WebGLProgram | null = gl.createProgram();
		if (!program) throw new Error("Failed to create WebGL program");
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);

		if (!gl.getProgramParameter(program, gl.LINK_STATUS))
			console.trace(gl.getProgramInfoLog(program));

		return program;
	}

	function getUniforms(program: WebGLProgram): WebGLUniformMap {
		if (!gl) throw new Error("WebGL context not initialized");

		const uniforms: WebGLUniformMap = {};
		const uniformCount = gl.getProgramParameter(
			program,
			gl.ACTIVE_UNIFORMS,
		);
		for (let i = 0; i < uniformCount; i++) {
			const uniformName = gl.getActiveUniform(program, i)?.name;
			if (!uniformName) continue;
			let location = gl.getUniformLocation(program, uniformName);
			if (!location) continue;

			uniforms[uniformName] = location;
		}
		return uniforms;
	}

	function compileShader(
		type: number,
		source: string,
		keywords: string[] | null = null,
	) {
		if (!gl) throw new Error("WebGL context not initialized");

		source = addKeywords(source, keywords);

		const shader = gl.createShader(type);
		if (!shader) throw new Error("Failed to create WebGL shader");

		gl.shaderSource(shader, source);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
			console.trace(gl.getShaderInfoLog(shader));

		return shader;
	}

	function addKeywords(source: string, keywords: string[] | null) {
		if (keywords == null) return source;
		let keywordsString = "";
		keywords.forEach((keyword) => {
			keywordsString += "#define " + keyword + "\n";
		});
		return keywordsString + source;
	}

	function createBlit(gl: WebGL2RenderingContext) {
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
			gl.STATIC_DRAW,
		);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
		gl.bufferData(
			gl.ELEMENT_ARRAY_BUFFER,
			new Uint16Array([0, 1, 2, 0, 2, 3]),
			gl.STATIC_DRAW,
		);
		gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(0);

		return (target: any, clear = false) => {
			if (target == null) {
				gl.viewport(
					0,
					0,
					gl.drawingBufferWidth,
					gl.drawingBufferHeight,
				);
				gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			} else {
				gl.viewport(0, 0, target.width, target.height);
				gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
			}
			if (clear) {
				gl.clearColor(0.0, 0.0, 0.0, 1.0);
				gl.clear(gl.COLOR_BUFFER_BIT);
			}
			gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
		};
	}

	function initFramebuffers() {
		if (!gl) throw new Error("WebGL context not initialized");

		const simRes = getResolution(SIM_RESOLUTION);
		const dyeRes = getResolution(DYE_RESOLUTION);

		const texType = ext.halfFloatTexType;
		const rgba = ext.formatRGBA;
		const rg = ext.formatRG;
		const r = ext.formatR;
		const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

		gl.disable(gl.BLEND);

		if (dye == null)
			dye = createDoubleFBO(
				dyeRes.width,
				dyeRes.height,
				rgba.internalFormat,
				rgba.format,
				texType,
				filtering,
			);
		else
			dye = resizeDoubleFBO(
				dye,
				dyeRes.width,
				dyeRes.height,
				rgba.internalFormat,
				rgba.format,
				texType,
				filtering,
			);

		if (velocity == null)
			velocity = createDoubleFBO(
				simRes.width,
				simRes.height,
				rg.internalFormat,
				rg.format,
				texType,
				filtering,
			);
		else
			velocity = resizeDoubleFBO(
				velocity,
				simRes.width,
				simRes.height,
				rg.internalFormat,
				rg.format,
				texType,
				filtering,
			);

		divergence = createFBO(
			simRes.width,
			simRes.height,
			r.internalFormat,
			r.format,
			texType,
			gl.NEAREST,
		);
		curl = createFBO(
			simRes.width,
			simRes.height,
			r.internalFormat,
			r.format,
			texType,
			gl.NEAREST,
		);
		pressure = createDoubleFBO(
			simRes.width,
			simRes.height,
			r.internalFormat,
			r.format,
			texType,
			gl.NEAREST,
		);
	}

	function createFBO(
		w: number,
		h: number,
		internalFormat: number,
		format: number,
		type: number,
		param: number,
	) {
		if (!gl) throw new Error("WebGL context not initialized");

		gl.activeTexture(gl.TEXTURE0);
		const texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texImage2D(
			gl.TEXTURE_2D,
			0,
			internalFormat,
			w,
			h,
			0,
			format,
			type,
			null,
		);

		const fbo = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
		gl.framebufferTexture2D(
			gl.FRAMEBUFFER,
			gl.COLOR_ATTACHMENT0,
			gl.TEXTURE_2D,
			texture,
			0,
		);
		gl.viewport(0, 0, w, h);
		gl.clear(gl.COLOR_BUFFER_BIT);

		const texelSizeX = 1.0 / w;
		const texelSizeY = 1.0 / h;

		return {
			texture,
			fbo,
			width: w,
			height: h,
			texelSizeX,
			texelSizeY,
			attach(id: number) {
				if (!gl) throw new Error("WebGL context not initialized");

				gl.activeTexture(gl.TEXTURE0 + id);
				gl.bindTexture(gl.TEXTURE_2D, texture);
				return id;
			},
		};
	}

	function createDoubleFBO(
		w: number,
		h: number,
		internalFormat: number,
		format: number,
		type: number,
		param: number,
	) {
		let fbo1 = createFBO(w, h, internalFormat, format, type, param);
		let fbo2 = createFBO(w, h, internalFormat, format, type, param);

		return {
			width: w,
			height: h,
			texelSizeX: fbo1.texelSizeX,
			texelSizeY: fbo1.texelSizeY,
			get read() {
				return fbo1;
			},
			set read(value) {
				fbo1 = value;
			},
			get write() {
				return fbo2;
			},
			set write(value) {
				fbo2 = value;
			},
			swap() {
				const temp = fbo1;
				fbo1 = fbo2;
				fbo2 = temp;
			},
		};
	}

	function resizeFBO(target: any, w: number, h: number, internalFormat: number, format: number, type: number, param: number) {
		if (!gl) throw new Error("WebGL context not initialized");

		const newFBO = createFBO(w, h, internalFormat, format, type, param);
		copyProgram.bind();
		gl.uniform1i(copyProgram.uniforms.uTexture, target.attach(0));
		blit(newFBO);
		return newFBO;
	}

	function resizeDoubleFBO(
		target: any,
		w: number,
		h: number,
		internalFormat: number,
		format: number,
		type: number,
		param: number,
	) {
		if (target.width == w && target.height == h) return target;
		target.read = resizeFBO(
			target.read,
			w,
			h,
			internalFormat,
			format,
			type,
			param,
		);
		target.write = createFBO(w, h, internalFormat, format, type, param);
		target.width = w;
		target.height = h;
		target.texelSizeX = 1.0 / w;
		target.texelSizeY = 1.0 / h;
		return target;
	}

	function updateKeywords() {
		const displayKeywords: string[] = [];
		if (SHADING) displayKeywords.push("SHADING");
		displayMaterial.setKeywords(displayKeywords);
	}

	function update(recurse = true) {
		const dt = calcDeltaTime();
		if (dt != 0) {
			FPS = (1 / dt + 3 * FPS) / 4;
		}

		frameCount++;

		// Adaptive quality: reduce quality when FPS drops below 30
		// Only check after warmup period to avoid false positives from initialization
		if (frameCount > WARMUP_FRAMES && FPS < 30 && !qualityReduced) {
			qualityReduced = true;
			console.log("Fluid simulation quality reduced for performance.");
		}

		if (resizeCanvas()) initFramebuffers();
		applyInputs();
		if (!PAUSED) step(dt);
		render(null);

		if (recurse) {
			requestAnimationFrame(() => {
				update((recurse = true));
			});
		}
	}

	function calcDeltaTime() {
		const now = Date.now();
		let dt = (now - lastUpdateTime) / 1000;
		dt = Math.min(dt, MAX_STEP_SIZE);
		lastUpdateTime = now;
		return dt;
	}

	function resizeCanvas() {
		if (!canvas) return false;
		const width = scaleByPixelRatio(canvas.clientWidth || 1);
		const height = scaleByPixelRatio(canvas.clientHeight || 1);
		if (canvas.width != width || canvas.height != height) {
			canvas.width = width;
			canvas.height = height;
			return true;
		}
		return false;
	}

	function applyInputs() {
		if (splatStack.length > 0) multipleSplats(splatStack.pop()!);

		pointers.forEach((p) => {
			if (p.moved) {
				p.moved = false;
				splatPointer(p);
			}
		});
	}

	function step(dt: number) {
		if (!gl) throw new Error("WebGL context not initialized");

		gl.disable(gl.BLEND);

		curlProgram.bind();
		gl.uniform2f(
			curlProgram.uniforms.texelSize,
			velocity.texelSizeX,
			velocity.texelSizeY,
		);
		gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
		blit(curl);

		vorticityProgram.bind();
		gl.uniform2f(
			vorticityProgram.uniforms.texelSize,
			velocity.texelSizeX,
			velocity.texelSizeY,
		);
		gl.uniform1i(
			vorticityProgram.uniforms.uVelocity,
			velocity.read.attach(0),
		);
		gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
		gl.uniform1f(vorticityProgram.uniforms.curl, CURL);
		gl.uniform1f(vorticityProgram.uniforms.dt, dt);
		blit(velocity.write);
		velocity.swap();

		divergenceProgram.bind();
		gl.uniform2f(
			divergenceProgram.uniforms.texelSize,
			velocity.texelSizeX,
			velocity.texelSizeY,
		);
		gl.uniform1i(
			divergenceProgram.uniforms.uVelocity,
			velocity.read.attach(0),
		);
		blit(divergence);

		clearProgram.bind();
		gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
		gl.uniform1f(clearProgram.uniforms.value, PRESSURE);
		blit(pressure.write);
		pressure.swap();

		pressureProgram.bind();
		gl.uniform2f(
			pressureProgram.uniforms.texelSize,
			velocity.texelSizeX,
			velocity.texelSizeY,
		);
		gl.uniform1i(
			pressureProgram.uniforms.uDivergence,
			divergence.attach(0),
		);
		const iterations = qualityReduced ? REDUCED_PRESSURE_ITERATIONS : PRESSURE_ITERATIONS;
		for (let i = 0; i < iterations; i++) {
			gl.uniform1i(
				pressureProgram.uniforms.uPressure,
				pressure.read.attach(1),
			);
			blit(pressure.write);
			pressure.swap();
		}

		gradienSubtractProgram.bind();
		gl.uniform2f(
			gradienSubtractProgram.uniforms.texelSize,
			velocity.texelSizeX,
			velocity.texelSizeY,
		);
		gl.uniform1i(
			gradienSubtractProgram.uniforms.uPressure,
			pressure.read.attach(0),
		);
		gl.uniform1i(
			gradienSubtractProgram.uniforms.uVelocity,
			velocity.read.attach(1),
		);
		blit(velocity.write);
		velocity.swap();

		advectionProgram.bind();
		gl.uniform2f(
			advectionProgram.uniforms.texelSize,
			velocity.texelSizeX,
			velocity.texelSizeY,
		);
		if (!ext.supportLinearFiltering)
			gl.uniform2f(
				advectionProgram.uniforms.dyeTexelSize,
				velocity.texelSizeX,
				velocity.texelSizeY,
			);
		const velocityId = velocity.read.attach(0);
		gl.uniform1i(advectionProgram.uniforms.uVelocity, velocityId);
		gl.uniform1i(advectionProgram.uniforms.uSource, velocityId);
		gl.uniform1f(advectionProgram.uniforms.dt, dt);
		gl.uniform1f(
			advectionProgram.uniforms.dissipation,
			VELOCITY_DISSIPATION,
		);
		blit(velocity.write);
		velocity.swap();

		if (!ext.supportLinearFiltering)
			gl.uniform2f(
				advectionProgram.uniforms.dyeTexelSize,
				dye.texelSizeX,
				dye.texelSizeY,
			);
		gl.uniform1i(
			advectionProgram.uniforms.uVelocity,
			velocity.read.attach(0),
		);
		gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
		gl.uniform1f(
			advectionProgram.uniforms.dissipation,
			DENSITY_DISSIPATION,
		);
		blit(dye.write);
		dye.swap();
	}

	function render(target: any) {
		if (!gl) return;
		gl.disable(gl.BLEND);
		drawDisplay(target);
	}

	function drawColor(target: any, color: {r: number, g: number, b: number}) {
		if (!gl) return;
		colorProgram.bind();
		gl.uniform4f(colorProgram.uniforms.color, color.r, color.g, color.b, 1);
		blit(target);
	}

	function drawDisplay(target: any) {
		if (!gl) return;
		const width = target == null ? gl.drawingBufferWidth : target.width;
		const height = target == null ? gl.drawingBufferHeight : target.height;

		displayMaterial.bind();
		if (SHADING)
			gl.uniform2f(
				displayMaterial.uniforms.texelSize,
				1.0 / width,
				1.0 / height,
			);
		gl.uniform1i(displayMaterial.uniforms.uTexture, dye.read.attach(0));
		blit(target);
	}

	function splatPointer(pointer: PointerInfo) {
		const dx = pointer.deltaX * SPLAT_FORCE;
		const dy = pointer.deltaY * SPLAT_FORCE;
		splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
	}

	export function splatPoint(
		x: number,
		y: number,
		dx: number,
		dy: number,
		color: RGBColour | undefined,
	) {
		if (!canvas) {
			return;
		}

		let xRelative = scaleByPixelRatio(x) / canvas.width;
		let yRelative = 1 - scaleByPixelRatio(y) / canvas.height;
		let colorChosen = color ?? generateColor();
		colorChosen.r *= 10;
		colorChosen.g *= 10;
		colorChosen.b *= 10;
		console.log(xRelative, yRelative, dx, dy, colorChosen);
		splat(xRelative, yRelative, dx, dy, colorChosen);
	}

	function multipleSplats(amount: number) {
		for (let i = 0; i < amount; i++) {
			const color = generateColor();
			color.r *= 10.0;
			color.g *= 10.0;
			color.b *= 10.0;
			const x = Math.random();
			const y = Math.random();
			const dx = 1000 * (Math.random() - 0.5);
			const dy = 1000 * (Math.random() - 0.5);
			splat(x, y, dx, dy, color);
		}
	}

	function splat(
		x: number,
		y: number,
		dx: number,
		dy: number,
		color: RGBColour,
	) {
		if (!gl) {
			return;
		}

		splatProgram.bind();
		gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
		gl.uniform1f(
			splatProgram.uniforms.aspectRatio,
			canvas.width / canvas.height,
		);
		gl.uniform2f(splatProgram.uniforms.point, x, y);
		gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0.0);
		gl.uniform1f(
			splatProgram.uniforms.radius,
			correctRadius(SPLAT_RADIUS / 100.0),
		);
		blit(velocity.write);
		velocity.swap();

		gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
		gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
		blit(dye.write);
		dye.swap();
	}

	function correctRadius(radius: number) {
		const aspectRatio = canvas.width / canvas.height;
		if (aspectRatio > 1) radius *= aspectRatio;
		return radius;
	}

	function getResolution(resolution: number) {
		if (!gl) throw new Error("WebGL context not initialized");
		let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
		if (aspectRatio < 1) aspectRatio = 1.0 / aspectRatio;

		const min = Math.round(resolution);
		const max = Math.round(resolution * aspectRatio);

		if (gl.drawingBufferWidth > gl.drawingBufferHeight)
			return { width: max, height: min };
		else return { width: min, height: max };
	}

	let canvas: HTMLCanvasElement = $state() as HTMLCanvasElement;

	let gl: WebGL2RenderingContext | null = $state(null);
	let ext: {
		formatRGBA: any;
		halfFloatTexType: any;
		formatRG: any;
		formatR: any;
		supportLinearFiltering: any;
	};

	const pointers: PointerInfo[] = $state([]);
	const splatStack: number[] = [];

	let dye: any;
	let velocity: any;
	let divergence: any;
	let curl: any;
	let pressure: any;

	let copyProgram: ProgramInfo;
	let clearProgram: ProgramInfo;
	let colorProgram: ProgramInfo;
	let splatProgram: ProgramInfo;
	let advectionProgram: ProgramInfo;
	let divergenceProgram: ProgramInfo;
	let curlProgram: ProgramInfo;
	let vorticityProgram: ProgramInfo;
	let pressureProgram: ProgramInfo;
	let gradienSubtractProgram: ProgramInfo;

	let displayMaterial: any;

	let lastUpdateTime: number;

	let blit: (target: any, clear?: boolean) => void;

	// Adaptive quality state
	let qualityReduced = false;
	const REDUCED_PRESSURE_ITERATIONS = 10;
	let frameCount = 0;
	const WARMUP_FRAMES = 60; // Wait ~1 second at 60fps before checking quality

	onMount(() => {
		// Check for prefers-reduced-motion accessibility preference
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReducedMotion) {
			PAUSED = true;
			// Return early - don't initialize the full WebGL context for paused sim
			// Just render one static frame
		}

		resizeCanvas();

		pointers.push(createPointer());

		// getWebGLContext
		const params = {
			alpha: false,
			depth: false,
			stencil: false,
			antialias: false,
			desynchronized: true,
			powerPreference: 'high-performance' as WebGLPowerPreference,
		};

		gl = canvas.getContext("webgl2", params) as WebGL2RenderingContext | null;
		if (!gl) {
			console.error(
				"WebGL context not initialized, not continuing drawing",
			);
			return;
		}
		gl.getExtension("EXT_color_buffer_float");
		const supportLinearFiltering = gl.getExtension(
			"OES_texture_float_linear",
		);

		gl.clearColor(0.0, 0.0, 0.0, 1.0);

		const halfFloatTexType = gl.HALF_FLOAT;
		const formatRGBA = getSupportedFormat(
			gl,
			gl.RGBA16F,
			gl.RGBA,
			halfFloatTexType,
		);
		const formatRG = getSupportedFormat(
			gl,
			gl.RG16F,
			gl.RG,
			halfFloatTexType,
		);
		const formatR = getSupportedFormat(
			gl,
			gl.R16F,
			gl.RED,
			halfFloatTexType,
		);

		ext = {
			formatRGBA,
			formatRG,
			formatR,
			halfFloatTexType,
			supportLinearFiltering,
		};

		if (isMobile()) {
			DYE_RESOLUTION = 512;
		}
		if (!ext.supportLinearFiltering) {
			DYE_RESOLUTION = 512;
			SHADING = false;
		}

		const baseVertexShader = compileShader(
			gl.VERTEX_SHADER,
			shaders.baseVertexShader,
		);

		const copyShader = compileShader(
			gl.FRAGMENT_SHADER,
			shaders.copyShader,
		);
		const clearShader = compileShader(
			gl.FRAGMENT_SHADER,
			shaders.clearShader,
		);
		const colorShader = compileShader(
			gl.FRAGMENT_SHADER,
			shaders.colorShader,
		);
		const splatShader = compileShader(
			gl.FRAGMENT_SHADER,
			shaders.splatShader,
		);
		const advectionShader = compileShader(
			gl.FRAGMENT_SHADER,
			shaders.advectionShader,
			ext.supportLinearFiltering ? null : ["MANUAL_FILTERING"],
		);
		const divergenceShader = compileShader(
			gl.FRAGMENT_SHADER,
			shaders.divergenceShader,
		);
		const curlShader = compileShader(
			gl.FRAGMENT_SHADER,
			shaders.curlShader,
		);
		const vorticityShader = compileShader(
			gl.FRAGMENT_SHADER,
			shaders.vorticityShader,
		);
		const pressureShader = compileShader(
			gl.FRAGMENT_SHADER,
			shaders.pressureShader,
		);
		const gradientSubtractShader = compileShader(
			gl.FRAGMENT_SHADER,
			shaders.gradientSubtractShader,
		);

		blit = createBlit(gl);

		copyProgram = createProgram(baseVertexShader, copyShader);
		clearProgram = createProgram(baseVertexShader, clearShader);
		colorProgram = createProgram(baseVertexShader, colorShader);
		splatProgram = createProgram(baseVertexShader, splatShader);
		advectionProgram = createProgram(baseVertexShader, advectionShader);
		divergenceProgram = createProgram(baseVertexShader, divergenceShader);
		curlProgram = createProgram(baseVertexShader, curlShader);
		vorticityProgram = createProgram(baseVertexShader, vorticityShader);
		pressureProgram = createProgram(baseVertexShader, pressureShader);
		gradienSubtractProgram = createProgram(
			baseVertexShader,
			gradientSubtractShader,
		);

		displayMaterial = createMaterial(
			baseVertexShader,
			shaders.displayShader,
		);

		updateKeywords();
		initFramebuffers();
		multipleSplats(Math.trunc(Math.random() * 20) + 5);

		eventDispatch("loaded", {
			splatPoint,
		});

		lastUpdateTime = Date.now();
		update();
	});
	$effect.pre(() => {
		disableInteractive(INTERACTIVE);
	});
	// should work similarly to dat.gui's onFinishChange hook
	$effect.pre(() => {
		void SIM_RESOLUTION;
		void DYE_RESOLUTION;
		gl && initFramebuffers();
	});
	$effect.pre(() => {
		void SHADING;
		displayMaterial && updateKeywords();
	});
</script>

<canvas
	class="canvas"
	class:hide={generatedCanvasPrintFrames}
	out:fade={{ duration: 500 }}
	bind:this={canvas}
></canvas>
<div class="freeze-frame-container">
	{#each generatedCanvasPrintFrames || [] as frame}
		<img class="freeze-frame" src={frame} alt=""/>
	{/each}
</div>

{#if INTERACTIVE}
	<InteractiveMouse />
{/if}

<svelte:window
	onmouseup={() => INTERACTIVE && (pointers[0].down = false)}
	ontouchend={(e) => {
		if (!INTERACTIVE) return;

		const touches = e.changedTouches;
		for (let i = 0; i < touches.length; i++) {
			const pointer = pointers.find((p) => p.id == touches[i].identifier);
			if (pointer == null) continue;
			pointer.down = false;
		}
	}}
	onkeydown={(e) => {
		if (e.code === "KeyP" && !e.ctrlKey) {
			// We don't want to to trigger on Input elements
			const tagName = (e.target as HTMLElement)?.tagName?.toUpperCase();
			if (tagName === "INPUT" || tagName === "TEXTAREA") return;
			PAUSED = !PAUSED;
		}

		if (INTERACTIVE) {
			if (e.key === " ")
				splatStack.push(Math.trunc(Math.random() * RANDOM_SPLAT_FORCE) + RANDOM_SPLAT_FORCE/4);
		}
		if (SPLASH_ON_PRINT) {
			if (e.ctrlKey && e.key == "p") {
				console.log("Intercepting Print");
				let startTime = new Date();

				generatedCanvasPrintFrames = [];
				for (let bg = 0; bg < 4; bg++) {
					// Clear the canvas
					DENSITY_DISSIPATION = 100000000;
					VELOCITY_DISSIPATION = 10000000;
					step(MAX_STEP_SIZE);
					DENSITY_DISSIPATION = INITIAL_DENSITY_DISSIPATION;
					VELOCITY_DISSIPATION = INITIAL_VELOCITY_DISSIPATION;

					splatStack.push(Math.trunc(Math.random() * 20) + 5);
					// Apply Splats to canvas
					update(false);

					// Splats are just blobs without physics, run a few sim steps to get the "marbling" texture
					for (let i = 0; i < 6 * 60; i++) {
						step(MAX_STEP_SIZE / 2);
					}

					update(false);
					generatedCanvasPrintFrames?.push(canvas.toDataURL());
				}
				PAUSED = true;
				console.log("Print preprocessing complete");
				let processingTimeMs = +new Date() - +startTime;
				console.log(`Time to complete: ${processingTimeMs}ms`);
			}
		}
	}}
	onafterprint={() => {
		// PAUSED = false;
		// generatedCanvasPrintFrames = null;
	}}
	onmousedown={(e) => {
		if (!INTERACTIVE) return;
		const posX = scaleByPixelRatio(e.offsetX);
		const posY = scaleByPixelRatio(e.offsetY);
		let pointer = pointers.find((p) => p.id == -1);
		if (pointer == null) pointer = createPointer();
		updatePointerDownData(pointer, -1, posX, posY);
	}}
	onmousemove={(e) => {
		if (!INTERACTIVE) return;

		const pointer = pointers[0];
		if (!pointer.down) return;
		const posX = scaleByPixelRatio(e.offsetX);
		const posY = scaleByPixelRatio(e.offsetY);
		updatePointerMoveData(pointer, posX, posY);
	}}
	ontouchstart={(e) => {
		if (!INTERACTIVE) return;

		const touches = e.targetTouches;
		while (touches.length >= pointers.length)
			pointers.push(createPointer());
		for (let i = 0; i < touches.length; i++) {
			const posX = scaleByPixelRatio(touches[i].pageX);
			const posY = scaleByPixelRatio(touches[i].pageY);
			updatePointerDownData(
				pointers[i + 1],
				touches[i].identifier,
				posX,
				posY,
			);
		}
	}}
	ontouchmove={(e) => {
		if (!INTERACTIVE) return;

		const touches = e.targetTouches;
		for (let i = 0; i < touches.length; i++) {
			const pointer = pointers[i + 1];
			if (!pointer.down) continue;
			const posX = scaleByPixelRatio(touches[i].pageX);
			const posY = scaleByPixelRatio(touches[i].pageY);
			updatePointerMoveData(pointer, posX, posY);
		}
	}}
/>

<style lang="scss">
	@use "../../../variables.scss" as *;
	@media print {
		.canvas.hide {
			opacity: 0;
		}

		.freeze-frame-container {
			opacity: 0.8;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			pointer-events: none;
			z-index: -10;

			.freeze-frame {
				width: 100vw;
				// Not quite full height, overwise the next background will be placed on the page after the next
				height: 99vh;
			}
		}
	}

	.canvas {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		z-index: -10;
		contain: strict;

		@media print {
			box-shadow: #{repeat-with-join(
					"inset 0 0 " + calc($print-page-padding / 2) + " white",
					", ",
					10
				)};
		}
	}

</style>
