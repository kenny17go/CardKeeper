import type { OcrResult } from "../../pipelines/ocr/core";
import type { BoxStyleOptions } from "./types";
declare type DrawableImage = ImageBitmap | HTMLImageElement;
export interface SideBySideOptions {
    boxStyle: BoxStyleOptions;
    fontFamily: string;
    textPanelBackground: string;
    outputFormat: string;
    outputQuality: number;
}
export declare function renderSideBySideToCanvas(image: DrawableImage, result: OcrResult, options: SideBySideOptions): OffscreenCanvas | HTMLCanvasElement;
export declare function renderSideBySideToImageBitmap(image: DrawableImage, result: OcrResult, options: SideBySideOptions): Promise<ImageBitmap>;
export declare function renderSideBySideToBlob(image: DrawableImage, result: OcrResult, options: SideBySideOptions): Promise<Blob>;
export {};
//# sourceMappingURL=side-by-side.d.ts.map