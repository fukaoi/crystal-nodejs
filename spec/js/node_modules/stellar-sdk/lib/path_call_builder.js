"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PathCallBuilder = void 0;
var tslib_1 = require("tslib");
var call_builder_1 = require("./call_builder");
var PathCallBuilder = (function (_super) {
    tslib_1.__extends(PathCallBuilder, _super);
    function PathCallBuilder(serverUrl, source, destination, destinationAsset, destinationAmount) {
        var _this = _super.call(this, serverUrl) || this;
        _this.url.segment("paths");
        _this.url.setQuery("destination_account", destination);
        _this.url.setQuery("source_account", source);
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
    return PathCallBuilder;
}(call_builder_1.CallBuilder));
exports.PathCallBuilder = PathCallBuilder;
//# sourceMappingURL=path_call_builder.js.map