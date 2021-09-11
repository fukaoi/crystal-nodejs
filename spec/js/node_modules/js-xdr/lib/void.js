'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Void = undefined;

var _isUndefined = require('lodash/isUndefined');

var _isUndefined2 = _interopRequireDefault(_isUndefined);

var _ioMixin = require('./io-mixin');

var _ioMixin2 = _interopRequireDefault(_ioMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Void = exports.Void = {
  /* jshint unused: false */

  read: function read() {
    return undefined;
  },
  write: function write(value) {
    if (!(0, _isUndefined2.default)(value)) {
      throw new Error('XDR Write Error: trying to write value to a void slot');
    }
  },
  isValid: function isValid(value) {
    return (0, _isUndefined2.default)(value);
  }
};

(0, _ioMixin2.default)(Void);