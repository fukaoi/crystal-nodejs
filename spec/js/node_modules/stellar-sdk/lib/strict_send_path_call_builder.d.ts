/// <reference types="urijs" />
import { Asset } from "stellar-base";
import { CallBuilder } from "./call_builder";
import { ServerApi } from "./server_api";
export declare class StrictSendPathCallBuilder extends CallBuilder<ServerApi.CollectionPage<ServerApi.PaymentPathRecord>> {
    constructor(serverUrl: URI, sourceAsset: Asset, sourceAmount: string, destination: string | Asset[]);
}
