"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StellarTomlResolver = exports.STELLAR_TOML_MAX_SIZE = void 0;
var tslib_1 = require("tslib");
var axios_1 = tslib_1.__importDefault(require("axios"));
var toml_1 = tslib_1.__importDefault(require("toml"));
var config_1 = require("./config");
exports.STELLAR_TOML_MAX_SIZE = 100 * 1024;
var CancelToken = axios_1.default.CancelToken;
var StellarTomlResolver = (function () {
    function StellarTomlResolver() {
    }
    StellarTomlResolver.resolve = function (domain, opts) {
        if (opts === void 0) { opts = {}; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var allowHttp, timeout, protocol;
            return tslib_1.__generator(this, function (_a) {
                allowHttp = typeof opts.allowHttp === "undefined"
                    ? config_1.Config.isAllowHttp()
                    : opts.allowHttp;
                timeout = typeof opts.timeout === "undefined" ? config_1.Config.getTimeout() : opts.timeout;
                protocol = allowHttp ? "http" : "https";
                return [2, axios_1.default
                        .get(protocol + "://" + domain + "/.well-known/stellar.toml", {
                        maxContentLength: exports.STELLAR_TOML_MAX_SIZE,
                        cancelToken: timeout
                            ? new CancelToken(function (cancel) {
                                return setTimeout(function () { return cancel("timeout of " + timeout + "ms exceeded"); }, timeout);
                            })
                            : undefined,
                        timeout: timeout,
                    })
                        .then(function (response) {
                        try {
                            var tomlObject = toml_1.default.parse(response.data);
                            return Promise.resolve(tomlObject);
                        }
                        catch (e) {
                            return Promise.reject(new Error("stellar.toml is invalid - Parsing error on line " + e.line + ", column " + e.column + ": " + e.message));
                        }
                    })
                        .catch(function (err) {
                        if (err.message.match(/^maxContentLength size/)) {
                            throw new Error("stellar.toml file exceeds allowed size of " + exports.STELLAR_TOML_MAX_SIZE);
                        }
                        else {
                            throw err;
                        }
                    })];
            });
        });
    };
    return StellarTomlResolver;
}());
exports.StellarTomlResolver = StellarTomlResolver;
//# sourceMappingURL=stellar_toml_resolver.js.map