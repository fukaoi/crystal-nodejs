"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentServerTime = exports.SERVER_TIME_MAP = void 0;
var tslib_1 = require("tslib");
var axios_1 = tslib_1.__importDefault(require("axios"));
var urijs_1 = tslib_1.__importDefault(require("urijs"));
var version = require("../package.json").version;
exports.SERVER_TIME_MAP = {};
var HorizonAxiosClient = axios_1.default.create({
    headers: {
        "X-Client-Name": "js-stellar-sdk",
        "X-Client-Version": version,
    },
});
function _toSeconds(ms) {
    return Math.floor(ms / 1000);
}
HorizonAxiosClient.interceptors.response.use(function interceptorHorizonResponse(response) {
    var hostname = urijs_1.default(response.config.url).hostname();
    var serverTime = _toSeconds(Date.parse(response.headers.date));
    var localTimeRecorded = _toSeconds(new Date().getTime());
    if (!isNaN(serverTime)) {
        exports.SERVER_TIME_MAP[hostname] = {
            serverTime: serverTime,
            localTimeRecorded: localTimeRecorded,
        };
    }
    return response;
});
exports.default = HorizonAxiosClient;
function getCurrentServerTime(hostname) {
    var entry = exports.SERVER_TIME_MAP[hostname];
    if (!entry || !entry.localTimeRecorded || !entry.serverTime) {
        return null;
    }
    var serverTime = entry.serverTime, localTimeRecorded = entry.localTimeRecorded;
    var currentTime = _toSeconds(new Date().getTime());
    if (currentTime - localTimeRecorded > 60 * 5) {
        return null;
    }
    return currentTime - localTimeRecorded + serverTime;
}
exports.getCurrentServerTime = getCurrentServerTime;
//# sourceMappingURL=horizon_axios_client.js.map