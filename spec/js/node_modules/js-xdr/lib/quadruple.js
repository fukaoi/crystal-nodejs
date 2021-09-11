'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Quadruple = undefined;

var _ioMixin = require('./io-mixin');

var _ioMixin2 = _interopRequireDefault(_ioMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Quadruple = exports.Quadruple = {
  /* jshint unused: false */

  read: function read() {
    throw new Error('XDR Read Error: quadruple not supported');
  },
  write: function write() {
    throw new Error('XDR Write Error: quadruple not supported');
  },
  isValid: function isValid() {
    return false;
  }
};

(0, _ioMixin2.default)(Quadruple);