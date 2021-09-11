/// <reference types="urijs" />
import { CallBuilder } from "./call_builder";
import { ServerApi } from "./server_api";
export declare class AssetsCallBuilder extends CallBuilder<ServerApi.CollectionPage<ServerApi.AssetRecord>> {
    constructor(serverUrl: URI);
    forCode(value: string): AssetsCallBuilder;
    forIssuer(value: string): AssetsCallBuilder;
}
