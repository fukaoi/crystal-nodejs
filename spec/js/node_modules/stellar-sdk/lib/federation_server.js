"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FederationServer = exports.FEDERATION_RESPONSE_MAX_SIZE = void 0;
var tslib_1 = require("tslib");
var axios_1 = tslib_1.__importDefault(require("axios"));
var stellar_base_1 = require("stellar-base");
var urijs_1 = tslib_1.__importDefault(require("urijs"));
var config_1 = require("./config");
var errors_1 = require("./errors");
var stellar_toml_resolver_1 = require("./stellar_toml_resolver");
exports.FEDERATION_RESPONSE_MAX_SIZE = 100 * 1024;
var FederationServer = (function () {
    function FederationServer(serverURL, domain, opts) {
        if (opts === void 0) { opts = {}; }
        this.serverURL = urijs_1.default(serverURL);
        this.domain = domain;
        var allowHttp = typeof opts.allowHttp === "undefined"
            ? config_1.Config.isAllowHttp()
            : opts.allowHttp;
        this.timeout =
            typeof opts.timeout === "undefined" ? config_1.Config.getTimeout() : opts.timeout;
        if (this.serverURL.protocol() !== "https" && !allowHttp) {
            throw new Error("Cannot connect to insecure federation server");
        }
    }
    FederationServer.resolve = function (value, opts) {
        if (opts === void 0) { opts = {}; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var addressParts, domain, federationServer;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (value.indexOf("*") < 0) {
                            if (!stellar_base_1.StrKey.isValidEd25519PublicKey(value)) {
                                return [2, Promise.reject(new Error("Invalid Account ID"))];
                            }
                            return [2, Promise.resolve({ account_id: value })];
                        }
                        addressParts = value.split("*");
                        domain = addressParts[1];
                        if (addressParts.length !== 2 || !domain) {
                            return [2, Promise.reject(new Error("Invalid Stellar address"))];
                        }
                        return [4, FederationServer.createForDomain(domain, opts)];
                    case 1:
                        federationServer = _a.sent();
                        return [2, federationServer.resolveAddress(value)];
                }
            });
        });
    };
    FederationServer.createForDomain = function (domain, opts) {
        if (opts === void 0) { opts = {}; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var tomlObject;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, stellar_toml_resolver_1.StellarTomlResolver.resolve(domain, opts)];
                    case 1:
                        tomlObject = _a.sent();
                        if (!tomlObject.FEDERATION_SERVER) {
                            return [2, Promise.reject(new Error("stellar.toml does not contain FEDERATION_SERVER field"))];
                        }
                        return [2, new FederationServer(tomlObject.FEDERATION_SERVER, domain, opts)];
                }
            });
        });
    };
    FederationServer.prototype.resolveAddress = function (address) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var stellarAddress, url;
            return tslib_1.__generator(this, function (_a) {
                stellarAddress = address;
                if (address.indexOf("*") < 0) {
                    if (!this.domain) {
                        return [2, Promise.reject(new Error("Unknown domain. Make sure `address` contains a domain (ex. `bob*stellar.org`) or pass `domain` parameter when instantiating the server object."))];
                    }
                    stellarAddress = address + "*" + this.domain;
                }
                url = this.serverURL.query({ type: "name", q: stellarAddress });
                return [2, this._sendRequest(url)];
            });
        });
    };
    FederationServer.prototype.resolveAccountId = function (accountId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var url;
            return tslib_1.__generator(this, function (_a) {
                url = this.serverURL.query({ type: "id", q: accountId });
                return [2, this._sendRequest(url)];
            });
        });
    };
    FederationServer.prototype.resolveTransactionId = function (transactionId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var url;
            return tslib_1.__generator(this, function (_a) {
                url = this.serverURL.query({ type: "txid", q: transactionId });
                return [2, this._sendRequest(url)];
            });
        });
    };
    FederationServer.prototype._sendRequest = function (url) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var timeout;
            return tslib_1.__generator(this, function (_a) {
                timeout = this.timeout;
                return [2, axios_1.default
                        .get(url.toString(), {
                        maxContentLength: exports.FEDERATION_RESPONSE_MAX_SIZE,
                        timeout: timeout,
                    })
                        .then(function (response) {
                        if (typeof response.data.memo !== "undefined" &&
                            typeof response.data.memo !== "string") {
                            throw new Error("memo value should be of type string");
                        }
                        return response.data;
                    })
                        .catch(function (response) {
                        if (response instanceof Error) {
                            if (response.message.match(/^maxContentLength size/)) {
                                throw new Error("federation response exceeds allowed size of " + exports.FEDERATION_RESPONSE_MAX_SIZE);
                            }
                            else {
                                return Promise.reject(response);
                            }
                        }
                        else {
                            return Promise.reject(new errors_1.BadResponseError("Server query failed. Server responded: " + response.status + " " + response.statusText, response.data));
                        }
                    })];
            });
        });
    };
    return FederationServer;
}());
exports.FederationServer = FederationServer;
//# sourceMappingURL=federation_server.js.map