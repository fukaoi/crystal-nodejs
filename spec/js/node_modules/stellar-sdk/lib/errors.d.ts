import { Horizon } from "./horizon_api";
export declare class NetworkError extends Error {
    response: {
        data?: Horizon.ErrorResponseData;
        status?: number;
        statusText?: string;
        url?: string;
    };
    __proto__: NetworkError;
    constructor(message: string, response: any);
    getResponse(): {
        data?: Horizon.ErrorResponseData.RateLimitExceeded | Horizon.ErrorResponseData.InternalServerError | Horizon.ErrorResponseData.TransactionFailed | undefined;
        status?: number | undefined;
        statusText?: string | undefined;
        url?: string | undefined;
    };
}
export declare class NotFoundError extends NetworkError {
    constructor(message: string, response: any);
}
export declare class BadRequestError extends NetworkError {
    constructor(message: string, response: any);
}
export declare class BadResponseError extends NetworkError {
    constructor(message: string, response: any);
}
export declare class InvalidSep10ChallengeError extends Error {
    __proto__: InvalidSep10ChallengeError;
    constructor(message: string);
}
export declare class AccountRequiresMemoError extends Error {
    __proto__: AccountRequiresMemoError;
    accountId: string;
    operationIndex: number;
    constructor(message: string, accountId: string, operationIndex: number);
}
