'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VarArray = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _every = require('lodash/every');

var _every2 = _interopRequireDefault(_every);

var _each = require('lodash/each');

var _each2 = _interopRequireDefault(_each);

var _times = require('lodash/times');

var _times2 = _interopRequireDefault(_times);

var _isArray = require('lodash/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

var _unsignedInt = require('./unsigned-int');

var _int = require('./int');

var _ioMixin = require('./io-mixin');

var _ioMixin2 = _interopRequireDefault(_ioMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VarArray = exports.VarArray = function () {
  function VarArray(childType) {
    var maxLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _unsignedInt.UnsignedInt.MAX_VALUE;

    _classCallCheck(this, VarArray);

    this._childType = childType;
    this._maxLength = maxLength;
  }

  _createClass(VarArray, [{
    key: 'read',
    value: function read(io) {
      var _this = this;

      var length = _int.Int.read(io);

      if (length > this._maxLength) {
        throw new Error('XDR Read Error: Saw ' + length + ' length VarArray,' + ('max allowed is ' + this._maxLength));
      }

      return (0, _times2.default)(length, function () {
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

      if (value.length > this._maxLength) {
        throw new Error('XDR Write Error: Got array of size ' + value.length + ',' + ('max allowed is ' + this._maxLength));
      }

      _int.Int.write(value.length, io);
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
      if (value.length > this._maxLength) {
        return false;
      }

      return (0, _every2.default)(value, function (child) {
        return _this3._childType.isValid(child);
      });
    }
  }]);

  return VarArray;
}();

(0, _ioMixin2.default)(VarArray.prototype);