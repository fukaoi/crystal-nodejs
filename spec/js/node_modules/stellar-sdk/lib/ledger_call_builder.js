"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerCallBuilder = void 0;
var tslib_1 = require("tslib");
var call_builder_1 = require("./call_builder");
var LedgerCallBuilder = (function (_super) {
    tslib_1.__extends(LedgerCallBuilder, _super);
    function LedgerCallBuilder(serverUrl) {
        var _this = _super.call(this, serverUrl) || this;
        _this.url.segment("ledgers");
        return _this;
    }
    LedgerCallBuilder.prototype.ledger = function (sequence) {
        this.filter.push(["ledgers", sequence.toString()]);
        return this;
    };
    return LedgerCallBuilder;
}(call_builder_1.CallBuilder));
exports.LedgerCallBuilder = LedgerCallBuilder;
//# sourceMappingURL=ledger_call_builder.js.map