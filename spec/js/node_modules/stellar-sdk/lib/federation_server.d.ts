export declare const FEDERATION_RESPONSE_MAX_SIZE: number;
export declare class FederationServer {
    private readonly serverURL;
    private readonly domain;
    private readonly timeout;
    static resolve(value: string, opts?: FederationServer.Options): Promise<FederationServer.Record>;
    static createForDomain(domain: string, opts?: FederationServer.Options): Promise<FederationServer>;
    constructor(serverURL: string, domain: string, opts?: FederationServer.Options);
    resolveAddress(address: string): Promise<FederationServer.Record>;
    resolveAccountId(accountId: string): Promise<FederationServer.Record>;
    resolveTransactionId(transactionId: string): Promise<FederationServer.Record>;
    private _sendRequest;
}
export declare namespace FederationServer {
    interface Record {
        account_id: string;
        memo_type?: string;
        memo?: string;
    }
    interface Options {
        allowHttp?: boolean;
        timeout?: number;
    }
}
