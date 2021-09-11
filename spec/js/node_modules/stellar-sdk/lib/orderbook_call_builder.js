"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderbookCallBuilder = void 0;
var tslib_1 = require("tslib");
var call_builder_1 = require("./call_builder");
var OrderbookCallBuilder = (function (_super) {
    tslib_1.__extends(OrderbookCallBuilder, _super);
    function OrderbookCallBuilder(serverUrl, selling, buying) {
        var _this = _super.call(this, serverUrl) || this;
        _this.url.segment("order_book");
        if (!selling.isNative()) {
            _this.url.setQuery("selling_asset_type", selling.getAssetType());
            _this.url.setQuery("selling_asset_code", selling.getCode());
            _this.url.setQuery("selling_asset_issuer", selling.getIssuer());
        }
        else {
            _this.url.setQuery("selling_asset_type", "native");
        }
        if (!buying.isNative()) {
            _this.url.setQuery("buying_asset_type", buying.getAssetType());
            _this.url.setQuery("buying_asset_code", buying.getCode());
            _this.url.setQuery("buying_asset_issuer", buying.getIssuer());
        }
        else {
            _this.url.setQuery("buying_asset_type", "native");
        }
        return _this;
    }
    return OrderbookCallBuilder;
}(call_builder_1.CallBuilder));
exports.OrderbookCallBuilder = OrderbookCallBuilder;
//# sourceMappingURL=orderbook_call_builder.js.map