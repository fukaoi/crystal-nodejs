"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountRequiresMemoError = exports.InvalidSep10ChallengeError = exports.BadResponseError = exports.BadRequestError = exports.NotFoundError = exports.NetworkError = void 0;
var tslib_1 = require("tslib");
var NetworkError = (function (_super) {
    tslib_1.__extends(NetworkError, _super);
    function NetworkError(message, response) {
        var _newTarget = this.constructor;
        var _this = this;
        var trueProto = _newTarget.prototype;
        _this = _super.call(this, message) || this;
        _this.__proto__ = trueProto;
        _this.constructor = NetworkError;
        _this.response = response;
        return _this;
    }
    NetworkError.prototype.getResponse = function () {
        return this.response;
    };
    return NetworkError;
}(Error));
exports.NetworkError = NetworkError;
var NotFoundError = (function (_super) {
    tslib_1.__extends(NotFoundError, _super);
    function NotFoundError(message, response) {
        var _newTarget = this.constructor;
        var _this = this;
        var trueProto = _newTarget.prototype;
        _this = _super.call(this, message, response) || this;
        _this.__proto__ = trueProto;
        _this.constructor = NotFoundError;
        _this.name = "NotFoundError";
        return _this;
    }
    return NotFoundError;
}(NetworkError));
exports.NotFoundError = NotFoundError;
var BadRequestError = (function (_super) {
    tslib_1.__extends(BadRequestError, _super);
    function BadRequestError(message, response) {
        var _newTarget = this.constructor;
        var _this = this;
        var trueProto = _newTarget.prototype;
        _this = _super.call(this, message, response) || this;
        _this.__proto__ = trueProto;
        _this.constructor = BadRequestError;
        _this.name = "BadRequestError";
        return _this;
    }
    return BadRequestError;
}(NetworkError));
exports.BadRequestError = BadRequestError;
var BadResponseError = (function (_super) {
    tslib_1.__extends(BadResponseError, _super);
    function BadResponseError(message, response) {
        var _newTarget = this.constructor;
        var _this = this;
        var trueProto = _newTarget.prototype;
        _this = _super.call(this, message, response) || this;
        _this.__proto__ = trueProto;
        _this.constructor = BadResponseError;
        _this.name = "BadResponseError";
        return _this;
    }
    return BadResponseError;
}(NetworkError));
exports.BadResponseError = BadResponseError;
var InvalidSep10ChallengeError = (function (_super) {
    tslib_1.__extends(InvalidSep10ChallengeError, _super);
    function InvalidSep10ChallengeError(message) {
        var _newTarget = this.constructor;
        var _this = this;
        var trueProto = _newTarget.prototype;
        _this = _super.call(this, message) || this;
        _this.__proto__ = trueProto;
        _this.constructor = InvalidSep10ChallengeError;
        _this.name = "InvalidSep10ChallengeError";
        return _this;
    }
    return InvalidSep10ChallengeError;
}(Error));
exports.InvalidSep10ChallengeError = InvalidSep10ChallengeError;
var AccountRequiresMemoError = (function (_super) {
    tslib_1.__extends(AccountRequiresMemoError, _super);
    function AccountRequiresMemoError(message, accountId, operationIndex) {
        var _newTarget = this.constructor;
        var _this = this;
        var trueProto = _newTarget.prototype;
        _this = _super.call(this, message) || this;
        _this.__proto__ = trueProto;
        _this.constructor = AccountRequiresMemoError;
        _this.name = "AccountRequiresMemoError";
        _this.accountId = accountId;
        _this.operationIndex = operationIndex;
        return _this;
    }
    return AccountRequiresMemoError;
}(Error));
exports.AccountRequiresMemoError = AccountRequiresMemoError;
//# sourceMappingURL=errors.js.map