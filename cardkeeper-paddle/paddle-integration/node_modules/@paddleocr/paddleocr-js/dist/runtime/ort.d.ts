export declare type OrtModule = typeof import("onnxruntime-web");
export interface WebGpuState {
    available: boolean;
    reason: string;
}
export interface OrtOptions {
    backend?: "webgpu" | "wasm" | "auto" | (string & {});
    wasmPaths?: string;
    numThreads?: number;
    simd?: boolean;
    proxy?: boolean;
    disableWasmProxy?: boolean;
}
export interface OrtRuntimeResult {
    ort: OrtModule;
    webgpuState: WebGpuState;
    backend: string;
}
export interface SessionState {
    session: import("onnxruntime-web").InferenceSession;
    provider: string;
}
export declare function detectWebGpuAvailability(): Promise<WebGpuState>;
export declare function getProviderCandidates(backend: string, webgpuState: WebGpuState): string[][];
export declare function initOrtRuntime(ortOptions?: OrtOptions | string): Promise<OrtRuntimeResult>;
export declare function createSession(ort: OrtModule, modelBytes: Uint8Array, providerCandidates: string[][]): Promise<SessionState>;
export declare function releaseSessions(...sessions: Array<import("onnxruntime-web").InferenceSession | null | undefined>): Promise<void>;
//# sourceMappingURL=ort.d.ts.map