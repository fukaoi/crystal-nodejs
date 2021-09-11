/// <reference types="urijs" />
import { Asset } from "stellar-base";
import { CallBuilder } from "./call_builder";
import { ServerApi } from "./server_api";
export declare class StrictReceivePathCallBuilder extends CallBuilder<ServerApi.CollectionPage<ServerApi.PaymentPathRecord>> {
    constructor(serverUrl: URI, source: string | Asset[], destinationAsset: Asset, destinationAmount: string);
}
