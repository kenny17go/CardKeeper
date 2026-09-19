import type { ModelAsset } from "../../resources/model-asset";
import type { LimitType } from "./runtime-params";
export interface NormalizedPipelineConfig {
    pipelineName: string;
    raw: Record<string, unknown>;
    warnings: string[];
    unsupportedFeatures: string[];
    modelSelection: PipelineModelSelection;
    assets: Partial<Record<string, ModelAsset>>;
    runtimeDefaults: PipelineRuntimeDefaults;
    pipelineBatchSize: number;
    textDetectionBatchSize: number;
    textRecognitionBatchSize: number;
}
export interface PipelineModelSelection {
    textDetectionModelName: string | null;
    textRecognitionModelName: string | null;
}
export interface PipelineRuntimeDefaults {
    text_det_limit_side_len?: number;
    text_det_limit_type?: LimitType;
    text_det_max_side_limit?: number;
    text_det_thresh?: number;
    text_det_box_thresh?: number;
    text_det_unclip_ratio?: number;
    text_rec_score_thresh?: number;
}
declare type YamlObject = Record<string, unknown>;
export declare function toFiniteNumber(value: unknown): number | undefined;
export declare function parseOcrPipelineConfigText(text: string): YamlObject;
export declare function normalizeOcrPipelineConfig(input: unknown): NormalizedPipelineConfig;
export {};
//# sourceMappingURL=config.d.ts.map