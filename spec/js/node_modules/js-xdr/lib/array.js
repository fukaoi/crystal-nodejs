'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Array = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _every = require('lodash/every');

var _every2 = _interopRequireDefault(_every);

var _each = require('lodash/each');

var _each2 = _interopRequireDefault(_each);

var _times = require('lodash/times');

var _times2 = _interopRequireDefault(_times);

var _isArray = require('lodash/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

var _ioMixin = require('./io-mixin');

var _ioMixin2 = _interopRequireDefault(_ioMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Array = exports.Array = function () {
  function Array(childType, length) {
    _classCallCheck(this, Array);

    this._childType = childType;
    this._length = length;
  }

  _createClass(Array, [{
    key: 'read',
    value: function read(io) {
      var _this = this;

      return (0, _times2.default)(this._length, function () {
        return _this._childType.read(io);
      });
    }
  }, {
    key: 'write',
    value: function write(value, io) {
      var _this2 = this;

      if (!(0, _isArray2.default)(value)) {
        throw new Error('XDR Write Error: value is not array');
      }

      if (value.length !== this._length) {
        throw new Error('XDR Write Error: Got array of size ' + value.length + ',' + ('expected ' + this._length));
      }

      (0, _each2.default)(value, function (child) {
        return _this2._childType.write(child, io);
      });
    }
  }, {
    key: 'isValid',
    value: function isValid(value) {
      var _this3 = this;

      if (!(0, _isArray2.default)(value)) {
        return false;
      }
      if (value.length !== this._length) {
        return false;
      }

      return (0, _every2.default)(value, function (child) {
        return _this3._childType.isValid(child);
      });
    }
  }]);

  return Array;
}();

(0, _ioMixin2.default)(Array.prototype);