declare const REQUEST_KIND = "worker-transport-request";
declare const RESPONSE_KIND = "worker-transport-response";
export interface SerializedError {
    name: string;
    message: string;
    stack: string;
}
export interface TransportRequest {
    kind: typeof REQUEST_KIND;
    type: string;
    payload: unknown;
    requestId: number;
}
export interface TransportSuccessResponse {
    kind: typeof RESPONSE_KIND;
    status: "success";
    requestId: number;
    payload: unknown;
}
export interface TransportErrorResponse {
    kind: typeof RESPONSE_KIND;
    status: "error";
    requestId: number;
    error: SerializedError;
}
export declare type TransportResponse = TransportSuccessResponse | TransportErrorResponse;
export declare function createTransportRequest(type: string, payload: unknown, requestId: number): TransportRequest;
export declare function createTransportSuccess(requestId: number, payload: unknown): TransportSuccessResponse;
export declare function createTransportError(requestId: number, error: unknown): TransportErrorResponse;
export declare function isTransportRequest(message: unknown): message is TransportRequest;
export declare function isTransportResponse(message: unknown): message is TransportResponse;
export declare function serializeError(error: unknown): SerializedError;
export declare function deserializeError(error: unknown): Error;
export {};
//# sourceMappingURL=protocol.d.ts.map