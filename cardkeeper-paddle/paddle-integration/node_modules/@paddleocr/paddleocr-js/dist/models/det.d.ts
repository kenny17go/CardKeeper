import type { OpenCv, Mat } from "@techstark/opencv-js";
import type { OrtModule, WebGpuState, SessionState } from "../runtime/ort";
import type { NormalizeConfig, DetBox } from "./common";
export declare type LimitType = "min" | "max";
export interface DetRuntimeOverrides {
    batchSize?: number;
    thresh?: number;
    boxThresh?: number;
    unclipRatio?: number;
    limitSideLen?: number;
    limitType?: LimitType;
    maxSideLimit?: number;
}
export interface DetPostprocessConfig {
    thresh: number;
    boxThresh: number;
    maxCandidates: number;
    unclipRatio: number;
}
export interface DetModelConfig {
    resizeLong: number;
    limitType: LimitType;
    maxSideLimit: number;
    normalize: NormalizeConfig;
    postprocess: DetPostprocessConfig;
}
export interface DetModel {
    readonly kind: "det";
    readonly config: DetModelConfig;
    readonly provider: string;
    predict(cv: OpenCv, mats: Mat[], overrides?: DetRuntimeOverrides): Promise<DetResult[]>;
    dispose(): Promise<void>;
}
export interface DetResult {
    boxes: DetBox[];
    srcW: number;
    srcH: number;
}
export declare const DEFAULT_DET_MODEL_PARSE_FALLBACKS: Readonly<DetModelConfig>;
export declare const DEFAULT_DET_MODEL_CONFIG: Readonly<DetModelConfig>;
export declare function parseDetModelConfigText(text: string): DetModelConfig;
interface CreateDetModelArgs {
    ort: OrtModule;
    modelBytes: Uint8Array;
    configText: string;
    backend: string;
    webgpuState: WebGpuState;
    batchSize?: number;
}
export declare function createDetModel({ ort, modelBytes, configText, backend, webgpuState, batchSize: batchSizeArg }: CreateDetModelArgs): Promise<DetModel>;
export declare function createDetModelSession(ort: OrtModule, modelBytes: Uint8Array, backend: string, webgpuState: WebGpuState): Promise<SessionState>;
export {};
//# sourceMappingURL=det.d.ts.map