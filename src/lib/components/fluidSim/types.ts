interface WebGLUniformMap {
    [key: string]: WebGLUniformLocation;
}
interface WebGLProgramMap {
    [key: string]: WebGLProgram;
}

interface ProgramInfo {
    program: WebGLProgram;
    uniforms: WebGLUniformMap;
    bind: () => void;
}

interface PointerInfo{
    id: number;
    texcoordX: number;
    texcoordY: number;
    prevTexcoordX: number;
    prevTexcoordY: number;
    deltaX: number;
    deltaY: number;
    down: boolean;
    moved: boolean;
    color: RGBColour;
}

interface RGBColour {
    r: number;
    g: number;
    b: number;
}
