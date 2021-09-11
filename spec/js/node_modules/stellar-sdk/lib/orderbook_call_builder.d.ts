/// <reference types="urijs" />
import { Asset } from "stellar-base";
import { CallBuilder } from "./call_builder";
import { ServerApi } from "./server_api";
export declare class OrderbookCallBuilder extends CallBuilder<ServerApi.OrderbookRecord> {
    constructor(serverUrl: URI, selling: Asset, buying: Asset);
}
