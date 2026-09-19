import type { WorkerTransportClient, WorkerOptions } from "../../worker/client";
import type { OcrModelConfig, OcrRuntimeParamsInput } from "./runtime-params";
import type { InitializationSummary, OcrResult, OcrPipelineRunnerOptions } from "./core";
export declare class WorkerBackedPaddleOCR {
    private options;
    private lastInitializationSummary;
    private modelConfig;
    private transportClient;
    private initPromise;
    private disposed;
    constructor(options: OcrPipelineRunnerOptions, transportClient: WorkerTransportClient);
    ensureActive(): void;
    initialize(): Promise<InitializationSummary>;
    getInitializationSummary(): InitializationSummary | null;
    getModelConfig(): OcrModelConfig;
    predict(input: unknown, params?: OcrRuntimeParamsInput): Promise<OcrResult[]>;
    dispose(): Promise<void>;
}
export declare function createWorkerBackedPaddleOCR(options: OcrPipelineRunnerOptions, workerOptions?: WorkerOptions): WorkerBackedPaddleOCR;
//# sourceMappingURL=worker-backed.d.ts.map