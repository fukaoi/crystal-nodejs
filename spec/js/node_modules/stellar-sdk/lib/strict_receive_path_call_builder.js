"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrictReceivePathCallBuilder = void 0;
var tslib_1 = require("tslib");
var call_builder_1 = require("./call_builder");
var StrictReceivePathCallBuilder = (function (_super) {
    tslib_1.__extends(StrictReceivePathCallBuilder, _super);
    function StrictReceivePathCallBuilder(serverUrl, source, destinationAsset, destinationAmount) {
        var _this = _super.call(this, serverUrl) || this;
        _this.url.segment("paths/strict-receive");
        if (typeof source === "string") {
            _this.url.setQuery("source_account", source);
        }
        else {
            var assets = source
                .map(function (asset) {
                if (asset.isNative()) {
                    return "native";
                }
                return asset.getCode() + ":" + asset.getIssuer();
            })
                .join(",");
            _this.url.setQuery("source_assets", assets);
        }
        _this.url.setQuery("destination_amount", destinationAmount);
        if (!destinationAsset.isNative()) {
            _this.url.setQuery("destination_asset_type", destinationAsset.getAssetType());
            _this.url.setQuery("destination_asset_code", destinationAsset.getCode());
            _this.url.setQuery("destination_asset_issuer", destinationAsset.getIssuer());
        }
        else {
            _this.url.setQuery("destination_asset_type", "native");
        }
        return _this;
    }
    return StrictReceivePathCallBuilder;
}(call_builder_1.CallBuilder));
exports.StrictReceivePathCallBuilder = StrictReceivePathCallBuilder;
//# sourceMappingURL=strict_receive_path_call_builder.js.map