"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetsCallBuilder = void 0;
var tslib_1 = require("tslib");
var call_builder_1 = require("./call_builder");
var AssetsCallBuilder = (function (_super) {
    tslib_1.__extends(AssetsCallBuilder, _super);
    function AssetsCallBuilder(serverUrl) {
        var _this = _super.call(this, serverUrl) || this;
        _this.url.segment("assets");
        return _this;
    }
    AssetsCallBuilder.prototype.forCode = function (value) {
        this.url.setQuery("asset_code", value);
        return this;
    };
    AssetsCallBuilder.prototype.forIssuer = function (value) {
        this.url.setQuery("asset_issuer", value);
        return this;
    };
    return AssetsCallBuilder;
}(call_builder_1.CallBuilder));
exports.AssetsCallBuilder = AssetsCallBuilder;
//# sourceMappingURL=assets_call_builder.js.map