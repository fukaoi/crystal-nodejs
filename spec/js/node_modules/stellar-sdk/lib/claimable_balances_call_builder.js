"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaimableBalanceCallBuilder = void 0;
var tslib_1 = require("tslib");
var call_builder_1 = require("./call_builder");
var ClaimableBalanceCallBuilder = (function (_super) {
    tslib_1.__extends(ClaimableBalanceCallBuilder, _super);
    function ClaimableBalanceCallBuilder(serverUrl) {
        var _this = _super.call(this, serverUrl) || this;
        _this.url.segment("claimable_balances");
        return _this;
    }
    ClaimableBalanceCallBuilder.prototype.claimableBalance = function (claimableBalanceId) {
        var builder = new call_builder_1.CallBuilder(this.url.clone());
        builder.filter.push([claimableBalanceId]);
        return builder;
    };
    ClaimableBalanceCallBuilder.prototype.sponsor = function (sponsor) {
        this.url.setQuery("sponsor", sponsor);
        return this;
    };
    ClaimableBalanceCallBuilder.prototype.claimant = function (claimant) {
        this.url.setQuery("claimant", claimant);
        return this;
    };
    ClaimableBalanceCallBuilder.prototype.asset = function (asset) {
        this.url.setQuery("asset", asset.toString());
        return this;
    };
    return ClaimableBalanceCallBuilder;
}(call_builder_1.CallBuilder));
exports.ClaimableBalanceCallBuilder = ClaimableBalanceCallBuilder;
//# sourceMappingURL=claimable_balances_call_builder.js.map