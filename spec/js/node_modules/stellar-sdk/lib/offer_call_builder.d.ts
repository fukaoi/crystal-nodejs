/// <reference types="urijs" />
import { Asset } from "stellar-base";
import { CallBuilder } from "./call_builder";
import { ServerApi } from "./server_api";
export declare class OfferCallBuilder extends CallBuilder<ServerApi.CollectionPage<ServerApi.OfferRecord>> {
    constructor(serverUrl: URI);
    offer(offerId: string): CallBuilder<ServerApi.OfferRecord>;
    forAccount(id: string): this;
    buying(asset: Asset): this;
    selling(asset: Asset): this;
    sponsor(id: string): this;
}
