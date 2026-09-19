import type { OcrResult } from "../../pipelines/ocr/core";
import type { OcrVisualizerOptions } from "./types";
declare type DrawableImage = ImageBitmap | HTMLImageElement;
export declare class OcrVisualizer {
    private options;
    private loadedFace;
    constructor(options?: OcrVisualizerOptions);
    loadFont(): Promise<void>;
    renderSideBySide(image: DrawableImage, result: OcrResult, overrides?: Partial<OcrVisualizerOptions>): Promise<ImageBitmap>;
    toBlob(image: DrawableImage, result: OcrResult, overrides?: Partial<OcrVisualizerOptions>): Promise<Blob>;
    dispose(): void;
}
export declare function renderOcrToBlob(image: DrawableImage, result: OcrResult, options?: OcrVisualizerOptions): Promise<Blob>;
export {};
//# sourceMappingURL=renderer.d.ts.map