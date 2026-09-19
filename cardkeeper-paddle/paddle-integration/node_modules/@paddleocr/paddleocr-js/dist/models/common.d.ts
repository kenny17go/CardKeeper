import type { OpenCv, Mat } from "@techstark/opencv-js";
export declare type Point2D = [number, number];
export interface NormalizeConfig {
    mean: number[];
    std: number[];
    scale: number;
}
export interface MiniBox {
    box: Point2D[];
    side: number;
}
export interface DetBox {
    poly: Point2D[];
    score: number;
}
declare type YamlValue = string | number | boolean | null | YamlValue[] | {
    [key: string]: YamlValue;
};
declare type YamlObject = Record<string, YamlValue>;
export declare function parseInferenceConfigText(text: string): YamlObject;
export declare function parseScaleValue(rawScale: unknown, fallback: number): number;
export declare function getTransformOp(transformOps: Array<Record<string, unknown>> | undefined, opName: string): Record<string, unknown> | null;
export declare function extractInferenceModelName(configText: string): string | null;
export declare function toBgrFloatCHWFromBgr(bgr: Uint8Array, width: number, height: number, normalizeConfig: NormalizeConfig): Float32Array;
export declare function unclip(poly: Point2D[], unclipRatio: number): Point2D[] | null;
export declare function getMiniBoxFromPoints(cv: OpenCv, points: Point2D[]): MiniBox;
export declare function boxScoreFast(cv: OpenCv, predMat: Mat, box: Point2D[]): number;
export {};
//# sourceMappingURL=common.d.ts.map