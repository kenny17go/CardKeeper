import type { DetModelConfig, DetRuntimeOverrides, LimitType } from "../../models/det";
import type { RecModelConfig } from "../../models/rec";
export type { LimitType };
export interface OcrModelConfig {
    det: DetModelConfig;
    rec: RecModelConfig;
}
export interface ResolvedOcrParams {
    det: DetRuntimeOverrides;
    pipeline: {
        scoreThresh: number;
    };
}
export interface OcrRuntimeParamsInput {
    text_det_limit_side_len?: number;
    textDetLimitSideLen?: number;
    text_det_limit_type?: LimitType;
    textDetLimitType?: LimitType;
    text_det_max_side_limit?: number;
    textDetMaxSideLimit?: number;
    text_det_thresh?: number;
    textDetThresh?: number;
    text_det_box_thresh?: number;
    textDetBoxThresh?: number;
    text_det_unclip_ratio?: number;
    textDetUnclipRatio?: number;
    text_rec_score_thresh?: number;
    textRecScoreThresh?: number;
}
export declare function getOcrRuntimeParams(config: OcrModelConfig, defaults?: Partial<OcrRuntimeParamsInput>, params?: OcrRuntimeParamsInput): ResolvedOcrParams;
//# sourceMappingURL=runtime-params.d.ts.map