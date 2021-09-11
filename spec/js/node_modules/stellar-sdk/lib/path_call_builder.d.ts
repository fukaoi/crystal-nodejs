/// <reference types="urijs" />
import { Asset } from "stellar-base";
import { CallBuilder } from "./call_builder";
import { ServerApi } from "./server_api";
export declare class PathCallBuilder extends CallBuilder<ServerApi.CollectionPage<ServerApi.PaymentPathRecord>> {
    constructor(serverUrl: URI, source: string, destination: string, destinationAsset: Asset, destinationAmount: string);
}
