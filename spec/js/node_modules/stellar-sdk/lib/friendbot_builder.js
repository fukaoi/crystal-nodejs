"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendbotBuilder = void 0;
var tslib_1 = require("tslib");
var call_builder_1 = require("./call_builder");
var FriendbotBuilder = (function (_super) {
    tslib_1.__extends(FriendbotBuilder, _super);
    function FriendbotBuilder(serverUrl, address) {
        var _this = _super.call(this, serverUrl) || this;
        _this.url.segment("friendbot");
        _this.url.setQuery("addr", address);
        return _this;
    }
    return FriendbotBuilder;
}(call_builder_1.CallBuilder));
exports.FriendbotBuilder = FriendbotBuilder;
//# sourceMappingURL=friendbot_builder.js.map