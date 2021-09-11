'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Bool = undefined;

var _isBoolean = require('lodash/isBoolean');

var _isBoolean2 = _interopRequireDefault(_isBoolean);

var _int = require('./int');

var _ioMixin = require('./io-mixin');

var _ioMixin2 = _interopRequireDefault(_ioMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Bool = exports.Bool = {
  read: function read(io) {
    var value = _int.Int.read(io);

    switch (value) {
      case 0:
        return false;
      case 1:
        return true;
      default:
        throw new Error('XDR Read Error: Got ' + value + ' when trying to read a bool');
    }
  },
  write: function write(value, io) {
    var intVal = value ? 1 : 0;
    return _int.Int.write(intVal, io);
  },
  isValid: function isValid(value) {
    return (0, _isBoolean2.default)(value);
  }
};

(0, _ioMixin2.default)(Bool);