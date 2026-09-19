export interface ModelAsset {
    url: string;
}
export declare type ModelAssetsMap = Record<string, ModelAsset>;
export declare const DEFAULT_MODEL_ASSETS: ModelAssetsMap;
export declare const MODEL_ENTRY_PATHS: Readonly<Record<string, string>>;
export interface ModelLoadResult {
    modelBytes: Uint8Array;
    configText: string;
    download: ModelLoadSummary;
}
export interface ModelLoadSummary {
    url: string;
    bytes: number;
}
export declare function normalizeModelAsset(assetName: string, asset: unknown): ModelAsset;
export declare function normalizeAssets(assets: Record<string, unknown> | undefined): Record<string, ModelAsset>;
export declare function getModelEntryPath(slot: string): string | null;
export declare function assertModelResourceSlot(kind: string, slot: string, value: unknown): void;
export declare function assertModelResources(kind: string, resources: Record<string, unknown>): void;
export declare function loadModelAsset(asset: ModelAsset, fetchImpl?: typeof fetch): Promise<ModelLoadResult>;
//# sourceMappingURL=model-asset.d.ts.map