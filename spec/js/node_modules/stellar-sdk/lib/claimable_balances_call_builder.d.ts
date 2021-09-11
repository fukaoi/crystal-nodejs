/// <reference types="urijs" />
import { Asset } from "stellar-base";
import { CallBuilder } from "./call_builder";
import { ServerApi } from "./server_api";
export declare class ClaimableBalanceCallBuilder extends CallBuilder<ServerApi.CollectionPage<ServerApi.ClaimableBalanceRecord>> {
    constructor(serverUrl: URI);
    claimableBalance(claimableBalanceId: string): CallBuilder<ServerApi.ClaimableBalanceRecord>;
    sponsor(sponsor: string): this;
    claimant(claimant: string): this;
    asset(asset: Asset): this;
}
