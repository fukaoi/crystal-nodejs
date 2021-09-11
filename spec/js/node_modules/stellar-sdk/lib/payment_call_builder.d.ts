/// <reference types="urijs" />
import { CallBuilder } from "./call_builder";
import { ServerApi } from "./server_api";
export declare class PaymentCallBuilder extends CallBuilder<ServerApi.CollectionPage<ServerApi.PaymentOperationRecord>> {
    constructor(serverUrl: URI);
    forAccount(accountId: string): this;
    forLedger(sequence: number | string): this;
    forTransaction(transactionId: string): this;
}
