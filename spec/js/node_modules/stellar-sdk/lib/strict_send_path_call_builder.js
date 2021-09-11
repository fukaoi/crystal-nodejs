"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrictSendPathCallBuilder = void 0;
var tslib_1 = require("tslib");
var call_builder_1 = require("./call_builder");
var StrictSendPathCallBuilder = (function (_super) {
    tslib_1.__extends(StrictSendPathCallBuilder, _super);
    function StrictSendPathCallBuilder(serverUrl, sourceAsset, sourceAmount, destination) {
        var _this = _super.call(this, serverUrl) || this;
        _this.url.segment("paths/strict-send");
        if (sourceAsset.isNative()) {
            _this.url.setQuery("source_asset_type", "native");
        }
        else {
            _this.url.setQuery("source_asset_type", sourceAsset.getAssetType());
            _this.url.setQuery("source_asset_code", sourceAsset.getCode());
            _this.url.setQuery("source_asset_issuer", sourceAsset.getIssuer());
        }
        _this.url.setQuery("source_amount", sourceAmount);
        if (typeof destination === "string") {
            _this.url.setQuery("destination_account", destination);
        }
        else {
            var assets = destination
                .map(function (asset) {
                if (asset.isNative()) {
                    return "native";
                }
                return asset.getCode() + ":" + asset.getIssuer();
            })
                .join(",");
            _this.url.setQuery("destination_assets", assets);
        }
        return _this;
    }
    return StrictSendPathCallBuilder;
}(call_builder_1.CallBuilder));
exports.StrictSendPathCallBuilder = StrictSendPathCallBuilder;
//# sourceMappingURL=strict_send_path_call_builder.js.map