'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculatePadding = calculatePadding;
exports.slicePadding = slicePadding;

var _every = require('lodash/every');

var _every2 = _interopRequireDefault(_every);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function calculatePadding(length) {
  switch (length % 4) {
    case 0:
      return 0;
    case 1:
      return 3;
    case 2:
      return 2;
    case 3:
      return 1;
    default:
      return null;
  }
}
function slicePadding(io, length) {
  var padding = io.slice(length);
  var allZero = (0, _every2.default)(padding.buffer(), function (byte) {
    return byte === 0;
  });

  if (allZero !== true) {
    throw new Error('XDR Read Error: invalid padding');
  }
}