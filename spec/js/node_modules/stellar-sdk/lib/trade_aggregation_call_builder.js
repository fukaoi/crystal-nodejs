"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeAggregationCallBuilder = void 0;
var tslib_1 = require("tslib");
var call_builder_1 = require("./call_builder");
var errors_1 = require("./errors");
var allowedResolutions = [
    60000,
    300000,
    900000,
    3600000,
    86400000,
    604800000,
];
var TradeAggregationCallBuilder = (function (_super) {
    tslib_1.__extends(TradeAggregationCallBuilder, _super);
    function TradeAggregationCallBuilder(serverUrl, base, counter, start_time, end_time, resolution, offset) {
        var _this = _super.call(this, serverUrl) || this;
        _this.url.segment("trade_aggregations");
        if (!base.isNative()) {
            _this.url.setQuery("base_asset_type", base.getAssetType());
            _this.url.setQuery("base_asset_code", base.getCode());
            _this.url.setQuery("base_asset_issuer", base.getIssuer());
        }
        else {
            _this.url.setQuery("base_asset_type", "native");
        }
        if (!counter.isNative()) {
            _this.url.setQuery("counter_asset_type", counter.getAssetType());
            _this.url.setQuery("counter_asset_code", counter.getCode());
            _this.url.setQuery("counter_asset_issuer", counter.getIssuer());
        }
        else {
            _this.url.setQuery("counter_asset_type", "native");
        }
        if (typeof start_time !== "number" || typeof end_time !== "number") {
            throw new errors_1.BadRequestError("Invalid time bounds", [start_time, end_time]);
        }
        else {
            _this.url.setQuery("start_time", start_time.toString());
            _this.url.setQuery("end_time", end_time.toString());
        }
        if (!_this.isValidResolution(resolution)) {
            throw new errors_1.BadRequestError("Invalid resolution", resolution);
        }
        else {
            _this.url.setQuery("resolution", resolution.toString());
        }
        if (!_this.isValidOffset(offset, resolution)) {
            throw new errors_1.BadRequestError("Invalid offset", offset);
        }
        else {
            _this.url.setQuery("offset", offset.toString());
        }
        return _this;
    }
    TradeAggregationCallBuilder.prototype.isValidResolution = function (resolution) {
        for (var _i = 0, allowedResolutions_1 = allowedResolutions; _i < allowedResolutions_1.length; _i++) {
            var allowed = allowedResolutions_1[_i];
            if (allowed === resolution) {
                return true;
            }
        }
        return false;
    };
    TradeAggregationCallBuilder.prototype.isValidOffset = function (offset, resolution) {
        var hour = 3600000;
        return !(offset > resolution || offset >= 24 * hour || offset % hour !== 0);
    };
    return TradeAggregationCallBuilder;
}(call_builder_1.CallBuilder));
exports.TradeAggregationCallBuilder = TradeAggregationCallBuilder;
//# sourceMappingURL=trade_aggregation_call_builder.js.map