export declare function nowMs(): number;
export declare function clamp(value: number, min: number, max: number): number;
export declare function distance2(p0: [number, number], p1: [number, number]): number;
export declare function formatMs(value: number): string;
export declare function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T>;
export declare function resolveRuntimeBatchSize(override: unknown, defaultBatchSize: number): number;
export declare function chunkArray<T>(items: T[], size: number): T[][];
export declare function deepClone<T>(value: T): T;
//# sourceMappingURL=common.d.ts.map