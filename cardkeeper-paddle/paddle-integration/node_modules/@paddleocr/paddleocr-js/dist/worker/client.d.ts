export interface WorkerOptions {
    createWorker?: () => Worker;
}
export declare class WorkerTransportClient {
    private workerOptions;
    private worker;
    private pending;
    private nextRequestId;
    private disposed;
    constructor(workerOptions?: WorkerOptions);
    ensureActive(): void;
    ensureWorker(): Worker;
    request(type: string, payload: unknown, transferables?: Transferable[]): Promise<unknown>;
    disposeWorker(): void;
    dispose(): void;
}
export declare function createWorkerTransportClient(workerOptions: WorkerOptions): WorkerTransportClient;
//# sourceMappingURL=client.d.ts.map