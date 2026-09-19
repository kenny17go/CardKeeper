import type { OpenCv, Mat } from "@techstark/opencv-js";
export declare type ImageSource = ImageBitmap | Blob | HTMLCanvasElement | ImageData | HTMLImageElement;
export interface SourceMatResult {
    width: number;
    height: number;
    mat: Mat;
    dispose(): void;
}
export interface WorkerPayload {
    kind: "imageBitmap";
    imageBitmap: ImageBitmap;
}
export interface WorkerPayloadResult {
    payload: WorkerPayload;
    transferables: Transferable[];
}
export declare function ensureServedFromHttp(): void;
export declare function sourceToImageBitmap(source: ImageSource): Promise<ImageBitmap>;
export declare function bitmapToSourceMat(cv: OpenCv, imageBitmap: ImageBitmap): {
    canvas: HTMLCanvasElement;
    mat: Mat;
};
export declare function sourceToMat(cv: OpenCv, source: unknown): Promise<SourceMatResult>;
export declare function sourceToWorkerPayload(source: ImageSource): Promise<WorkerPayloadResult>;
//# sourceMappingURL=browser.d.ts.map