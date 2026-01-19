<script lang="ts">
  import { FastForward } from 'lucide-svelte';
	import { onMount } from 'svelte';

	// --- Configuration ---
	const SAMPLE_RATE_HZ = 9613;
	const WAVE_FREQ_HZ = 500;
	const SAMPLES_PER_CYCLE = SAMPLE_RATE_HZ / WAVE_FREQ_HZ; // 19.2 samples per cycle
	
	// Display settings
	let width = $state(700);
	const height = 200;
	const compositeHeight = 160;
	const amplitude = 70;
	const cyclesOnScreen = 4;
	// const displaySamples = Math.floor(SAMPLES_PER_CYCLE / 4); // Show fewer for visual clarity
    const displaySamples = SAMPLES_PER_CYCLE * cyclesOnScreen;

	// --- State ---
	let mode: 'standard' | 'supersample' = $state('supersample');
	let isRunning = $state(true);
	let noiseEnabled = $state(true);
	let noiseAmount = $state(0.15);
	let phaseNoiseStandard = $state(0);
	
	// Animation state
	let time = $state(0);
	let cycleCount = $state(0);
	let samplesV: Array<{x: number, y: number, noisy: number, phase: number}> = $state([]);
	let samplesI: Array<{x: number, y: number, noisy: number, phase: number}> = $state([]);
	let showcaseCycle = $state(false);
	let currentlyResetting = $state(false);
	
	// Composite samples (mapped to single cycle for supersample mode)
	let compositeV: Array<{phase: number, noisy: number}> = $state([]);
	let compositeI: Array<{phase: number, noisy: number}> = $state([]);
	
	// Standard mode reconstruction (all cycles, scaled to composite height)
	let standardReconstructionV: Array<{x: number, y: number}> = $state([]);
	let standardReconstructionI: Array<{x: number, y: number}> = $state([]);
	
	// Noise seed for consistency
	let noiseSeed = $state(Math.random() * 1000);
	
	// --- Wave Functions ---
	
	function getDistortion(phase: number, channel: number): number {
		if (!noiseEnabled) return 0;
		
		// Create periodic distortion (harmonics) instead of random noise
		// This simulates a real grid with clipped tops or non-linear loads
		let dist = 0;
		
		if (channel === 0) {
			// Voltage: Often flat-topped (3rd harmonic)
			dist += Math.sin(phase * 3) * 0.12;
			dist += Math.sin(phase * 5) * 0.05;
			dist += Math.sin(phase * 25) * 0.02; // Small ripple
		} else {
			// Current: Non-linear load distortion
			dist += Math.sin(phase * 3 - 0.5) * 0.15;
			dist += Math.sin(phase * 7) * 0.05;
			dist += Math.sin(phase * 15) * 0.03;
		}
		
		return dist * amplitude;
	}

	function getAnglerOffset() {
		return (mode==="standard") ? phaseNoiseStandard : 0;
	}
	
	function getVoltage(x: number, addNoise = false, index = 0): number {
		const t = (x / width) * (Math.PI * 2 * cyclesOnScreen) + getAnglerOffset();
		const base = height / 2 - Math.sin(t) * amplitude * 0.85;
		return addNoise ? base + getDistortion(t, 0) : base;
	}

	function getCurrent(x: number, addNoise = false, index = 0): number {
		const t = (x / width) * (Math.PI * 2 * cyclesOnScreen) + getAnglerOffset();
		// Load with slight phase shift (power factor simulation)
		const base = height / 2 - Math.sin(t - 0.3) * amplitude * 0.55;
		return addNoise ? base + getDistortion(t - 0.3, 1) : base;
	}
	
	// Get voltage/current for composite (single cycle)
	function getVoltageComposite(phase: number, addNoise = false, index = 0): number {
		const base = compositeHeight / 2 - Math.sin(phase + getAnglerOffset()) * (amplitude * 0.85 * compositeHeight / height);
		return addNoise ? base + getDistortion(phase, 0) * (compositeHeight / height) : base;
	}

	function getCurrentComposite(phase: number, addNoise = false, index = 0): number {
		const base = compositeHeight / 2 - Math.sin(phase - 0.3 + getAnglerOffset()) * (amplitude * 0.55 * compositeHeight / height);
		return addNoise ? base + getDistortion(phase - 0.3, 1) * (compositeHeight / height) : base;
	}
	
	// Calculate phase within cycle (0 to 2π)
	function getPhaseFromX(x: number): number {
		const cycleWidth = width / cyclesOnScreen;
		const posInCycle = x % cycleWidth;
		return (posInCycle / cycleWidth) * Math.PI * 2;
	}
	
	// Convert phase to X position in composite view
	function phaseToCompositeX(phase: number): number {
		return (phase / (Math.PI * 2)) * width;
	}
	
	// Reconstruct wave from samples using linear interpolation
	function buildReconstructedPath(samples: Array<{x: number, noisy: number}>): string {
		if (samples.length < 2) return '';
		const sorted = [...samples].sort((a, b) => a.x - b.x);
		return sorted.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.noisy}`).join(' ');
	}
	
	function buildCompositeReconstructedPath(samples: Array<{phase: number, noisy: number}>): string {
		if (samples.length < 2) return '';
		const sorted = [...samples].sort((a, b) => a.phase - b.phase);
		return sorted.map((p, i) => `${i === 0 ? 'M' : 'L'} ${phaseToCompositeX(p.phase)} ${p.noisy}`).join(' ');
	}
	
	// --- Reset ---
	function reset() {
		phaseNoiseStandard = (Math.random() - 0.5) * 2 * Math.PI;
		time = 0;
		cycleCount = 0;
		// samplesV = [];
		// samplesI = [];
		// compositeV = [];
		// compositeI = [];
		// standardReconstructionV = [];
		// standardReconstructionI = [];

		// Remove first and last to avoid visual artifacts
		// samplesI = samplesV.slice(1, -1);
		// samplesV = samplesV.slice(1, -1);
		// compositeV = compositeV.slice(1, -1);
		// compositeI = compositeI.slice(1, -1);
		// standardReconstructionV = standardReconstructionV.slice(1, -1);
		// standardReconstructionI = standardReconstructionI.slice(1, -1);

		noiseSeed = Math.random() * 1000;
		showcaseCycle = false;
		currentlyResetting = true;
	}

	
	// Phase error for standard mode (ADC mux switching delay)
	// const phaseErrorPixels = 12; // Removed: Visualizing samples off the line looks like a simulation error
	
	// --- Animation Loop ---
	$effect(() => {
		if (!isRunning) return;

		let animationFrame: number;
		const speed = 1.5;
		const sampleInterval = width / displaySamples;

		
		const update = () => {
			if (currentlyResetting) {
				if (samplesV.length || samplesI.length || compositeV.length || compositeI.length || standardReconstructionV.length || standardReconstructionI.length) {
					// Remove one sample per frame for smooth clearing
					samplesV = samplesV.slice(1);
					samplesI = samplesI.slice(1);
					compositeV = compositeV.slice(1);
					compositeI = compositeI.slice(1);
					standardReconstructionV = standardReconstructionV.slice(1);
					standardReconstructionI = standardReconstructionI.slice(1);
				} else {
					currentlyResetting = false;
				}

				animationFrame = requestAnimationFrame(update);
				return;
			}

			time += speed;

			// Wrap around
			if (time >= width || (showcaseCycle && time >= width/2)) {
				time = 0;
				cycleCount++;
				
				if (mode === 'supersample') {
					// After collecting both passes, keep showing the overlay
					if (cycleCount > 1) {
						showcaseCycle = true;
					}
					if (cycleCount > 2) {
						reset();
					}
				} else {
					if (cycleCount > 0) {
						showcaseCycle = true;
					}
					if (cycleCount > 1) {
						reset();
					}

				}
			}

			if (currentlyResetting || showcaseCycle) {
				animationFrame = requestAnimationFrame(update);
				return;
			}

			// Sampling Logic
			const sampleIndex = Math.floor(time / sampleInterval);
			const lastSampleIndex = Math.floor((time - speed) / sampleInterval);
			
			if (sampleIndex > lastSampleIndex && sampleIndex < displaySamples) {
				const sampleX = sampleIndex * sampleInterval;
				const phase = getPhaseFromX(sampleX);
				
				if (mode === 'standard'  && !showcaseCycle) {

					// Alternating: even samples = V, odd samples = I
					// This means each channel gets half the samples
					if (sampleIndex % 2 === 0) {
						const y = getVoltage(sampleX);
						const noisy = getVoltage(sampleX, true, sampleIndex + cycleCount * 1000);
						samplesV = [...samplesV, { x: sampleX, y, noisy, phase }];
						
						// Add to composite at phase position
						const compositeNoisy = getVoltageComposite(phase, true, sampleIndex + cycleCount * 1000);
						compositeV = [...compositeV, { phase, noisy: compositeNoisy }];
						
						// Add to standard reconstruction (actual x position, scaled y)
						const globalX = sampleX;
						const scaledY = compositeHeight / 2 - (height / 2 - noisy) * (compositeHeight / height);
						standardReconstructionV = [...standardReconstructionV, { x: globalX, y: scaledY }];
						console.log($state.snapshot(standardReconstructionV), globalX)
					} else {
						// Current sample - now perfectly timed on the grid (phase error comes from interleaving)
						const y = getCurrent(sampleX);
						const noisy = getCurrent(sampleX, true, sampleIndex + cycleCount * 1000);
						samplesI = [...samplesI, { x: sampleX, y, noisy, phase }];
						
						// Add to composite
						const compositeNoisy = getCurrentComposite(phase, true, sampleIndex + cycleCount * 1000);
						compositeI = [...compositeI, { phase, noisy: compositeNoisy }];
						
						// Add to standard reconstruction
						const globalX = sampleX;
						const scaledY = compositeHeight / 2 - (height / 2 - noisy) * (compositeHeight / height);
						standardReconstructionI = [...standardReconstructionI, { x: globalX, y: scaledY }];
					}
				} else if (mode === 'supersample' && !showcaseCycle) {
					// Super Sample Mode
					if (cycleCount === 0) {
						// Pass 1: Sample only Voltage
						const y = getVoltage(sampleX);
						const noisy = getVoltage(sampleX, true, sampleIndex);
						samplesV = [...samplesV, { x: sampleX, y, noisy, phase }];
						
						// Add to composite - all samples land at their phase position
						const compositeNoisy = getVoltageComposite(phase, true, sampleIndex);
						compositeV = [...compositeV, { phase, noisy: compositeNoisy }];
					} else if (cycleCount === 1) {
						// Pass 2: Sample only Current
						const y = getCurrent(sampleX);
						const noisy = getCurrent(sampleX, true, sampleIndex);
						samplesI = [...samplesI, { x: sampleX, y, noisy, phase }];
						
						// Add to composite at same phase position (phase-locked!)
						const compositeNoisy = getCurrentComposite(phase, true, sampleIndex);
						compositeI = [...compositeI, { phase, noisy: compositeNoisy }];
					}
				}
			}

			animationFrame = requestAnimationFrame(update);
		};

		animationFrame = requestAnimationFrame(update);
		return () => cancelAnimationFrame(animationFrame);
	});

	let reconstructedPathV = $derived(buildReconstructedPath(samplesV));
	let reconstructedPathI = $derived(buildReconstructedPath(samplesI));
	let compositePathV = $derived(buildCompositeReconstructedPath(compositeV));
	let compositePathI = $derived(buildCompositeReconstructedPath(compositeI));
	
	// Standard mode paths (simple x,y reconstruction)
	let standardPathV = $derived.by(() => {
		if (standardReconstructionV.length < 2) return '';
		return standardReconstructionV.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
	});
	let standardPathI = $derived.by(() => {
		if (standardReconstructionI.length < 2) return '';
		return standardReconstructionI.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
	});
	
	// Sample count info
	let vSampleCount = $derived(samplesV.length);
	let iSampleCount = $derived(samplesI.length);
	let compositeVCount = $derived(mode === 'supersample' ? compositeV.length : standardReconstructionV.length);
	let compositeICount = $derived(mode === 'supersample' ? compositeI.length : standardReconstructionI.length);

	// Reset when width changes to maintain sample alignment
	$effect(() => {
		width;
		reset();
	});

	// Ghost paths for background (reactive to noise setting)
	let ghostPathV = $derived(Array.from({length: Math.ceil(width)}, (_, i) => `${i === 0 ? 'M' : 'L'} ${i} ${getVoltage(i, noiseEnabled)}`).join(' '));
	let ghostPathI = $derived(Array.from({length: Math.ceil(width)}, (_, i) => `${i === 0 ? 'M' : 'L'} ${i} ${getCurrent(i, noiseEnabled)}`).join(' '));
</script>

<div class="container">
	<div class="header">
		<h3>{mode === "standard" ? 'Alternating Sampling' : 'Phase-Lock Sampling'}</h3>
		<div class="controls">
			<button class:active={mode === 'standard'} onclick={() => { mode = 'standard'; reset(); }}>
				Standard
			</button>
			<button class:active={mode === 'supersample'} onclick={() => { mode = 'supersample'; reset(); }}>
				Super Sample
			</button>
			<label class="noise-toggle">
				<input type="checkbox" bind:checked={noiseEnabled} />
				Distortion
			</label>
		</div>
	</div>
	<div class="oscilloscope" bind:clientWidth={width}>
		<svg viewBox="0 0 {width} {height}">
			<!-- Background Grid -->
			<defs>
				<pattern id="grid-minor" width="25" height="25" patternUnits="userSpaceOnUse">
					<path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(69, 25, 82, 0.15)" stroke-width="0.5"/>
				</pattern>
				<pattern id="grid-major" width="50" height="50" patternUnits="userSpaceOnUse">
					<rect width="50" height="50" fill="url(#grid-minor)"/>
					<path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(69, 25, 82, 0.3)" stroke-width="1"/>
				</pattern>
				<linearGradient id="voltage-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
					<stop offset="0%" stop-color="#4cc9f0" stop-opacity="0.8"/>
					<stop offset="100%" stop-color="#4361ee" stop-opacity="0.8"/>
				</linearGradient>
				<linearGradient id="current-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
					<stop offset="0%" stop-color="#f72585" stop-opacity="0.8"/>
					<stop offset="100%" stop-color="#b5179e" stop-opacity="0.8"/>
				</linearGradient>
				<filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
					<feGaussianBlur stdDeviation="2" result="coloredBlur"/>
					<feMerge>
						<feMergeNode in="coloredBlur"/>
						<feMergeNode in="SourceGraphic"/>
					</feMerge>
				</filter>
			</defs>
			
			<rect width="100%" height="100%" fill="#0a0a0f" />
			<rect width="100%" height="100%" fill="url(#grid-major)" />
			
			<!-- Center line -->
			<line x1="0" y1={height/2} x2={width} y2={height/2} stroke="rgba(255,255,255,0.1)" stroke-dasharray="4,4" />

			<!-- Zero Crossing Trigger Indicator (Super Sample mode) -->
			{#if mode === 'supersample'}
				<line x1="1" y1="0" x2="1" y2={height} stroke="#F39F5A" stroke-width="2" stroke-dasharray="4,4">
					<animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.5s" repeatCount="indefinite" />
				</line>
				<text x="8" y="18" fill="#F39F5A" font-size="10" font-family="monospace" opacity="0.9">ZC TRIGGER</text>
			{/if}

			<!-- Ghost Waveforms (ideal analog signals) -->
			<path 
				d={ghostPathV} 
				fill="none" 
				stroke="url(#voltage-gradient)" 
				stroke-width="1.5" 
				opacity="0.4"
			/>
			<path 
				d={ghostPathI} 
				fill="none" 
				stroke="url(#current-gradient)" 
				stroke-width="1.5" 
				opacity="0.4"
			/>

			<!-- Reconstructed Waveforms (from samples) -->
			{#if showcaseCycle}
				<path 
					d={reconstructedPathV} 
					fill="none" 
					stroke="url(#voltage-gradient)" 
					stroke-width="2" 
					opacity="0.9"
					filter="url(#glow)"
				/>
				<path 
					d={reconstructedPathI} 
					fill="none" 
					stroke="url(#current-gradient)" 
					stroke-width="2" 
					opacity="0.9"
					filter="url(#glow)"
				/>
			{/if}

			<!-- Sample Points: Voltage -->
			{#each samplesV as p, i}
				<line x1={p.x} y1={height/2} x2={p.x} y2={p.noisy} stroke="#4cc9f0" stroke-width="1" opacity="0.3" />
				<circle cx={p.x} cy={p.noisy} r="4" fill="#4cc9f0" opacity="0.9">
					{#if i === samplesV.length - 1 && cycleCount < 2}
						<animate attributeName="r" values="4;6;4" dur="0.3s" repeatCount="1" />
					{/if}
				</circle>
			{/each}

			<!-- Sample Points: Current -->
			{#each samplesI as p, i}
				<line x1={p.x} y1={height/2} x2={p.x} y2={p.noisy} stroke="#f72585" stroke-width="1" opacity="0.3" />
				<circle cx={p.x} cy={p.noisy} r="4" fill="#f72585" opacity="0.9">
					{#if i === samplesI.length - 1 && cycleCount < 2}
						<animate attributeName="r" values="4;6;4" dur="0.3s" repeatCount="1" />
					{/if}
				</circle>
			{/each}

			<!-- Scan Line (ADC sampling head) -->
			{#if !showcaseCycle}
				<line x1={time} y1="0" x2={time} y2={height} stroke="rgba(255,255,255,0.6)" stroke-width="1">
					<animate attributeName="opacity" values="0.6;0.3;0.6" dur="0.5s" repeatCount="indefinite" />
				</line>
			{/if}
			
			<!-- Channel Labels -->
			<g transform="translate({width - 85}, {height - 45})">
				<rect x="-5" y="-12" width="80" height="42" fill="rgba(0,0,0,0.6)" rx="4" />
				<circle cx="6" cy="0" r="5" fill="#4cc9f0" />
				<text x="16" y="4" fill="#4cc9f0" font-size="11" font-family="monospace">V ({vSampleCount})</text>
				<circle cx="6" cy="20" r="5" fill="#f72585" />
				<text x="16" y="24" fill="#f72585" font-size="11" font-family="monospace">I ({iSampleCount})</text>
			</g>
		</svg>
	</div>

	<!-- Composite Single-Cycle View -->
	<div class="composite-section">
		<div class="composite-header">
			<span class="composite-title">{mode === 'supersample' ? 'Reconstructed Single Cycle' : `Reconstructed Waveform (${cyclesOnScreen} cycles)`}</span>
			<span class="composite-count">V: {compositeVCount} samples · I: {compositeICount} samples</span>
		</div>
		<div class="oscilloscope composite">
			<svg viewBox="0 0 {width} {compositeHeight}">
				<defs>
					<pattern id="grid-composite-minor" width="25" height="20" patternUnits="userSpaceOnUse">
						<path d="M 25 0 L 0 0 0 20" fill="none" stroke="rgba(69, 25, 82, 0.15)" stroke-width="0.5"/>
					</pattern>
					<pattern id="grid-composite-major" width="50" height="40" patternUnits="userSpaceOnUse">
						<rect width="50" height="40" fill="url(#grid-composite-minor)"/>
						<path d="M 50 0 L 0 0 0 40" fill="none" stroke="rgba(69, 25, 82, 0.3)" stroke-width="1"/>
					</pattern>
				</defs>
				
				<rect width="100%" height="100%" fill="#0a0a0f" />
				<rect width="100%" height="100%" fill="url(#grid-composite-major)" />
				
				<!-- Center line -->
				<line x1="0" y1={compositeHeight/2} x2={width} y2={compositeHeight/2} stroke="rgba(255,255,255,0.1)" stroke-dasharray="4,4" />
				
				{#if mode === 'supersample'}
					<!-- Phase markers (single cycle) -->
					<line x1={width/4} y1="0" x2={width/4} y2={compositeHeight} stroke="rgba(255,255,255,0.05)" />
					<line x1={width/2} y1="0" x2={width/2} y2={compositeHeight} stroke="rgba(255,255,255,0.08)" />
					<line x1={width*3/4} y1="0" x2={width*3/4} y2={compositeHeight} stroke="rgba(255,255,255,0.05)" />
					
					<!-- Phase labels -->
					<text x="5" y={compositeHeight - 5} fill="rgba(255,255,255,0.3)" font-size="9" font-family="monospace">0°</text>
					<text x={width/4 - 10} y={compositeHeight - 5} fill="rgba(255,255,255,0.3)" font-size="9" font-family="monospace">90°</text>
					<text x={width/2 - 12} y={compositeHeight - 5} fill="rgba(255,255,255,0.3)" font-size="9" font-family="monospace">180°</text>
					<text x={width*3/4 - 12} y={compositeHeight - 5} fill="rgba(255,255,255,0.3)" font-size="9" font-family="monospace">270°</text>
					<text x={width - 25} y={compositeHeight - 5} fill="rgba(255,255,255,0.3)" font-size="9" font-family="monospace">360°</text>

					<!-- Reconstructed paths from composite samples (single cycle) -->
					{#if compositeV.length >= 2}
						<path 
							d={compositePathV} 
							fill="none" 
							stroke="url(#voltage-gradient)" 
							stroke-width="2" 
							opacity="0.7"
						/>
					{/if}
					{#if compositeI.length >= 2}
						<path 
							d={compositePathI} 
							fill="none" 
							stroke="url(#current-gradient)" 
							stroke-width="2" 
							opacity="0.7"
						/>
					{/if}

					<!-- Composite Sample Points: Voltage -->
					{#each compositeV as p, i}
						<circle cx={phaseToCompositeX(p.phase)} cy={p.noisy} r="3" fill="#4cc9f0" opacity="0.85">
							{#if i === compositeV.length - 1 && cycleCount < 2}
								<animate attributeName="r" values="3;5;3" dur="0.2s" repeatCount="1" />
							{/if}
						</circle>
					{/each}

					<!-- Composite Sample Points: Current -->
					{#each compositeI as p, i}
						<circle cx={phaseToCompositeX(p.phase)} cy={p.noisy} r="3" fill="#f72585" opacity="0.85">
							{#if i === compositeI.length - 1 && cycleCount < 2}
								<animate attributeName="r" values="3;5;3" dur="0.2s" repeatCount="1" />
							{/if}
						</circle>
					{/each}
				{:else}
					<!-- Reconstructed paths from all samples (multi-cycle) -->
					{#if standardReconstructionV.length >= 2}
						<path 
							d={standardPathV} 
							fill="none" 
							stroke="url(#voltage-gradient)" 
							stroke-width="2.5" 
							opacity="0.85"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					{/if}
					{#if standardReconstructionI.length >= 2}
						<path 
							d={standardPathI} 
							fill="none" 
							stroke="url(#current-gradient)" 
							stroke-width="2.5" 
							opacity="0.85"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					{/if}

					<!-- Sample points for standard mode -->
					{#each standardReconstructionV as p, i}
						<circle cx={p.x} cy={p.y} r="3" fill="#4cc9f0" opacity="0.85">
							{#if i === standardReconstructionV.length - 1}
								<animate attributeName="r" values="3;5;3" dur="0.2s" repeatCount="1" />
							{/if}
						</circle>
					{/each}
					{#each standardReconstructionI as p, i}
						<circle cx={p.x} cy={p.y} r="3" fill="#f72585" opacity="0.85">
							{#if i === standardReconstructionI.length - 1}
								<animate attributeName="r" values="3;5;3" dur="0.2s" repeatCount="1" />
							{/if}
						</circle>
					{/each}
				{/if}

				<!-- Label -->
				<g transform="translate(10, 15)">
					<rect x="-5" y="-10" width="95" height="18" fill="rgba(0,0,0,0.6)" rx="3" />
					<text fill="rgba(255,255,255,0.7)" font-size="10" font-family="monospace">
						{mode === 'supersample' ? 'Phase-Aligned' : 'Sequential Fill'}
					</text>
				</g>
			</svg>
		</div>
	</div>

	<div class="info-panel">
		<div class="info-row">
			<span class="label">Sample Rate:</span>
			<span class="value">{(SAMPLE_RATE_HZ / 1000).toFixed(1)} kHz</span>
		</div>
		<div class="info-row">
			<span class="label">Wave Frequency:</span>
			<span class="value">{WAVE_FREQ_HZ} Hz</span>
		</div>
		<div class="info-row">
			<span class="label">Samples/Cycle:</span>
			<span class="value">{SAMPLES_PER_CYCLE}</span>
		</div>
	</div>

	<div class="explanation">
		{#if mode === 'standard'}
			<p>
				<strong>Standard ADC Sampling:</strong> The microcontroller alternates between reading Voltage and Current through a multiplexer. Each channel receives only <em>half</em> the samples, and the mux delay introduces <strong>phase error</strong> on the current channel.
			</p>
			<p>
				<strong>Bottom graph:</strong> As the ADC sweeps through {cyclesOnScreen} cycles, samples accumulate on the composite view from left to right. Notice how <span class="current-text">Current</span> samples are consistently offset from <span class="voltage-text">Voltage</span> — this error persists in the reconstruction.
			</p>
		{:else}
			<p>
				<strong>Phase-Locked Super Sampling:</strong> Using a hardware zero-cross interrupt, we synchronize sampling across multiple AC cycles:
			</p>
			<ol>
				<li><strong>Pass 1:</strong> Trigger on zero-cross → sample only <span class="voltage-text">Voltage</span> at full rate</li>
				<li><strong>Pass 2:</strong> Trigger on zero-cross → sample only <span class="current-text">Current</span> at full rate</li>
			</ol>
			<p>
				<strong>Bottom graph:</strong> Samples from both passes land at their <em>phase-relative</em> position on the single virtual cycle. Because both passes trigger at the same phase, <span class="voltage-text">V</span> and <span class="current-text">I</span> samples align perfectly — <strong>zero phase error</strong>, double the resolution per channel.
			</p>
		{/if}
	</div>
</div>

<style lang="scss">
	@use "../../../../variables.scss" as *;

	.container {
		margin: $space-md 0;
		padding: $space-sm;
		background: linear-gradient(135deg, rgba($primary-color, 0.03) 0%, rgba($secondary-color, 0.03) 100%);
		border: 1px solid rgba($primary-color, 0.15);
		border-radius: $border-radius;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: $space-xs;
		margin-bottom: $space-sm;
		
		h3 { 
			margin: 0; 
			font-size: 1.1rem;
			color: $text-color;
		}
	}

	.controls {
		display: flex;
		gap: $space-xs;
		align-items: center;
		flex-wrap: wrap;
		
		button {
			background: transparent;
			border: 1px solid $mid-tone;
			color: $hint-color;
			padding: 0.4rem 0.8rem;
			cursor: pointer;
			border-radius: $border-radius;
			transition: all 0.2s ease;
			font-size: 0.85rem;
			
			&:hover {
				border-color: $primary-color;
				color: $primary-color;
			}
			
			&.active {
				background: $primary-color;
				color: white;
				border-color: $primary-color;
				font-weight: 600;
			}
		}
		
		.noise-toggle {
			display: flex;
			align-items: center;
			gap: 0.3rem;
			font-size: 0.85rem;
			color: $hint-color;
			cursor: pointer;
			padding: 0.4rem 0.6rem;
            padding-left: 0;
			border-radius: $border-radius;
			transition: color 0.2s;
			
			&:hover {
				color: $text-color;
			}
			
			input {
				accent-color: $accent-color;
				cursor: pointer;
			}
		}
	}

	.oscilloscope {
		position: relative;
		background: #0a0a0f;
		border: 1px solid rgba($primary-color, 0.3);
		border-radius: $border-radius;
		overflow: hidden;
		box-shadow: 
			inset 0 0 30px rgba(0, 0, 0, 0.5),
			0 4px 20px rgba(0, 0, 0, 0.15);
		
		&.composite {
			box-shadow: 
				inset 0 0 20px rgba(0, 0, 0, 0.5),
				0 2px 10px rgba(0, 0, 0, 0.1);
		}
	}

	.composite-section {
		margin-top: $space-sm;
	}

	.composite-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: $space-xs;
		flex-wrap: wrap;
		gap: $space-xs;
		
		.composite-title {
			font-size: 0.9rem;
			font-weight: 600;
			color: $text-color;
		}
		
		.composite-count {
			@include mono-font;
			font-size: 0.75rem;
			color: $hint-color;
		}
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
	}

	.status-overlay {
		position: absolute;
		top: $space-xs;
		left: $space-xs;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.3rem 0.6rem;
		background: rgba(0, 0, 0, 0.7);
		border-radius: $border-radius;
		backdrop-filter: blur(4px);
	}

	.status-dot {
		width: 8px;
		height: 8px;
		background: $hint-color;
		border-radius: 50%;
		transition: background 0.2s;
		
		&.active {
			background: $positive-color;
			animation: pulse 1s ease infinite;
		}
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.4; }
	}

	.status-text {
		@include mono-font;
		font-size: 0.7rem;
		color: rgba(255, 255, 255, 0.8);
	}

	.info-panel {
		display: flex;
		gap: $space-sm;
		margin-top: $space-xs;
		padding: $space-xs;
		background: rgba($primary-color, 0.05);
		border-radius: $border-radius;
		flex-wrap: wrap;
		
		.info-row {
			display: flex;
			gap: 0.3rem;
			font-size: 0.8rem;
			
			.label {
				color: $hint-color;
			}
			.value {
				@include mono-font;
				color: $text-color;
				font-weight: 500;
			}
		}
	}

	.explanation {
		margin-top: $space-sm;
		padding: $space-sm;
		background: rgba($primary-color, 0.05);
		border-left: 3px solid $accent-color;
		border-radius: 0 $border-radius $border-radius 0;
		font-size: 0.9rem;
		line-height: 1.6;
		
		p {
			margin: 0 0 0.5rem 0;
			&:last-child { margin-bottom: 0; }
		}
		
		ol {
			margin: 0.5rem 0;
			padding-left: 1.5rem;
			
			li {
				margin-bottom: 0.25rem;
			}
		}
		
		.voltage-text {
			color: #4cc9f0;
			font-weight: 600;
		}
		
		.current-text {
			color: #f72585;
			font-weight: 600;
		}
	}

	@media screen and (max-width: $mobile-breakpoint) {
		.header {
			flex-direction: column;
			align-items: flex-start;
		}
		
		.info-panel {
			flex-direction: column;
			gap: $space-xs;
		}
	}
</style>