/// <reference types="urijs" />
import { CallBuilder } from "./call_builder";
import { ServerApi } from "./server_api";
export declare class LedgerCallBuilder extends CallBuilder<ServerApi.CollectionPage<ServerApi.LedgerRecord>> {
    constructor(serverUrl: URI);
    ledger(sequence: number | string): this;
}
