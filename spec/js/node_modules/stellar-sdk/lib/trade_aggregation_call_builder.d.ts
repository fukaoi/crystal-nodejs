/// <reference types="urijs" />
import { Asset } from "stellar-base";
import { CallBuilder } from "./call_builder";
import { Horizon } from "./horizon_api";
import { ServerApi } from "./server_api";
export declare class TradeAggregationCallBuilder extends CallBuilder<ServerApi.CollectionPage<TradeAggregationRecord>> {
    constructor(serverUrl: URI, base: Asset, counter: Asset, start_time: number, end_time: number, resolution: number, offset: number);
    private isValidResolution;
    private isValidOffset;
}
interface TradeAggregationRecord extends Horizon.BaseResponse {
    timestamp: number | string;
    trade_count: number | string;
    base_volume: string;
    counter_volume: string;
    avg: string;
    high: string;
    low: string;
    open: string;
    close: string;
}
export {};
