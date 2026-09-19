import type { NormalizedPipelineConfig } from "./config";
import type { OcrModelConfig } from "./runtime-params";
import type { OrtOptions } from "../../runtime/ort";
export interface ResolvedOcrOptions {
    pipelineConfig: NormalizedPipelineConfig;
    ortOptions: NormalizedOrtOptions;
}
export declare type ResolvedBackend = "webgpu" | "wasm" | "auto";
export interface NormalizedOrtOptions {
    backend: ResolvedBackend;
    wasmPaths?: string;
    numThreads?: number;
    simd?: boolean;
    proxy?: boolean;
}
export interface WorkerResolvedOptions {
    enabled: boolean;
    createWorker: (() => Worker) | null;
}
export declare const DEFAULT_OCR_CONFIG: OcrModelConfig;
export declare function validateLoadedModelName(modelRole: string, expectedModelName: string | null | undefined, configText: string): void;
export declare function normalizeOrtOptions(ortOptions?: OrtOptions): NormalizedOrtOptions;
export declare function resolveWorkerOptions(workerOption: unknown): WorkerResolvedOptions;
export declare function resolvePaddleOCROptions(options?: Record<string, unknown>): ResolvedOcrOptions;
export declare function cloneDefaultOcrConfig(): OcrModelConfig;
//# sourceMappingURL=shared.d.ts.map