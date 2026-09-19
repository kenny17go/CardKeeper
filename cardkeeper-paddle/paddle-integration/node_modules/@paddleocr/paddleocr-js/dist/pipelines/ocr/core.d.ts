import type { OpenCv } from "@techstark/opencv-js";
import type { ModelLoadSummary } from "../../resources/model-asset";
import type { DetModel } from "../../models/det";
import type { RecModel } from "../../models/rec";
import type { Point2D } from "../../models/common";
import type { OrtModule, WebGpuState, OrtOptions } from "../../runtime/ort";
import type { OcrModelConfig, OcrRuntimeParamsInput } from "./runtime-params";
import type { NormalizedPipelineConfig } from "./config";
import type { NormalizedOrtOptions } from "./shared";
import type { SourceMatResult } from "../../platform/browser";
export interface OcrResultItem {
    poly: Point2D[];
    text: string;
    score: number;
}
export interface OcrResultMetrics {
    detMs: number;
    recMs: number;
    totalMs: number;
    detectedBoxes: number;
    recognizedCount: number;
}
export interface OcrResultRuntime {
    requestedBackend: string;
    detProvider: string;
    recProvider: string;
    webgpuAvailable: boolean;
}
export interface OcrResult {
    image: {
        width: number;
        height: number;
    };
    items: OcrResultItem[];
    metrics: OcrResultMetrics;
    runtime: OcrResultRuntime;
}
export interface InitializationSummary {
    backend: string;
    webgpuAvailable: boolean;
    detProvider: string;
    recProvider: string;
    assets: ModelLoadSummary[];
    elapsedMs: number;
    pipelineConfigWarnings: string[];
}
export declare type SourceToMatFn = (cv: OpenCv, source: unknown) => SourceMatResult | Promise<SourceMatResult>;
declare type EnsureServedFromHttpFn = () => void;
export interface OcrPipelineRunnerOptions {
    pipelineConfig: NormalizedPipelineConfig;
    ortOptions?: OrtOptions | NormalizedOrtOptions;
    fetch?: typeof fetch;
    ensureServedFromHttp?: EnsureServedFromHttpFn;
    sourceToMat?: SourceToMatFn;
}
export declare class OcrPipelineRunner {
    protected options: OcrPipelineRunnerOptions;
    protected modelConfig: OcrModelConfig;
    protected runtimeDefaults: Partial<OcrRuntimeParamsInput>;
    protected cv: OpenCv | null;
    protected ort: OrtModule | null;
    protected detModel: DetModel | null;
    protected recModel: RecModel | null;
    protected webgpuState: WebGpuState;
    protected pipelineConfig: NormalizedPipelineConfig;
    protected lastInitializationSummary: InitializationSummary | null;
    private ensureServedFromHttp;
    private sourceToMat;
    constructor(options: OcrPipelineRunnerOptions);
    initialize(): Promise<InitializationSummary>;
    getInitializationSummary(): InitializationSummary | null;
    getModelConfig(): OcrModelConfig;
    predict(input: unknown, params?: OcrRuntimeParamsInput): Promise<OcrResult[]>;
    disposeModelsOnly(): Promise<void>;
    dispose(): Promise<void>;
}
export { OcrPipelineRunner as PaddleOCRCore };
//# sourceMappingURL=core.d.ts.map