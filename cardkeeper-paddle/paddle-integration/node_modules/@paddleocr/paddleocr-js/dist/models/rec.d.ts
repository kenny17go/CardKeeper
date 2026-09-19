import type { OpenCv, Mat } from "@techstark/opencv-js";
import type { OrtModule, WebGpuState, SessionState } from "../runtime/ort";
export interface RecModelConfig {
    imageShape: number[];
    charDict: string[];
}
export interface RecResult {
    text: string;
    score: number;
}
export interface RecRuntimeOverrides {
    batchSize?: number;
}
export interface RecModel {
    readonly kind: "rec";
    readonly config: RecModelConfig;
    readonly provider: string;
    predict(cv: OpenCv, mats: Mat[], overrides?: RecRuntimeOverrides): Promise<RecResult[]>;
    dispose(): Promise<void>;
}
export declare const DEFAULT_REC_MODEL_PARSE_FALLBACKS: Readonly<Pick<RecModelConfig, "imageShape" | "charDict">>;
export declare const DEFAULT_REC_RUNTIME_LIMITS: Readonly<{}>;
export declare const DEFAULT_REC_MODEL_CONFIG: Readonly<RecModelConfig>;
export declare function parseRecModelConfigText(text: string): RecModelConfig;
interface CreateRecModelArgs {
    ort: OrtModule;
    modelBytes: Uint8Array;
    configText: string;
    backend: string;
    webgpuState: WebGpuState;
    batchSize?: number;
}
export declare function createRecModel({ ort, modelBytes, configText, backend, webgpuState, batchSize: batchSizeArg }: CreateRecModelArgs): Promise<RecModel>;
export declare function createRecModelSession(ort: OrtModule, modelBytes: Uint8Array, backend: string, webgpuState: WebGpuState): Promise<SessionState>;
export {};
//# sourceMappingURL=rec.d.ts.map