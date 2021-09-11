"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
var tslib_1 = require("tslib");
var clone_1 = tslib_1.__importDefault(require("lodash/clone"));
var defaultConfig = {
    allowHttp: false,
    timeout: 0,
};
var config = clone_1.default(defaultConfig);
var Config = (function () {
    function Config() {
    }
    Config.setAllowHttp = function (value) {
        config.allowHttp = value;
    };
    Config.setTimeout = function (value) {
        config.timeout = value;
    };
    Config.isAllowHttp = function () {
        return config.allowHttp;
    };
    Config.getTimeout = function () {
        return config.timeout;
    };
    Config.setDefault = function () {
        config = Object.assign({}, defaultConfig);
    };
    return Config;
}());
exports.Config = Config;
//# sourceMappingURL=config.js.map