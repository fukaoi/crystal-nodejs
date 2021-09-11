'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UnsignedInt = undefined;

var _isNumber = require('lodash/isNumber');

var _isNumber2 = _interopRequireDefault(_isNumber);

var _ioMixin = require('./io-mixin');

var _ioMixin2 = _interopRequireDefault(_ioMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UnsignedInt = exports.UnsignedInt = {
  read: function read(io) {
    return io.readUInt32BE();
  },
  write: function write(value, io) {
    if (!(0, _isNumber2.default)(value)) {
      throw new Error('XDR Write Error: not a number');
    }

    if (Math.floor(value) !== value) {
      throw new Error('XDR Write Error: not an integer');
    }

    if (value < 0) {
      throw new Error('XDR Write Error: negative number ' + value);
    }

    io.writeUInt32BE(value);
  },
  isValid: function isValid(value) {
    if (!(0, _isNumber2.default)(value)) {
      return false;
    }
    if (Math.floor(value) !== value) {
      return false;
    }

    return value >= UnsignedInt.MIN_VALUE && value <= UnsignedInt.MAX_VALUE;
  }
};

UnsignedInt.MAX_VALUE = Math.pow(2, 32) - 1;
UnsignedInt.MIN_VALUE = 0;

(0, _ioMixin2.default)(UnsignedInt);