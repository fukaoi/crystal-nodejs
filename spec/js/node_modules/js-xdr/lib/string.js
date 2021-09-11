'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.String = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _isArray = require('lodash/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

var _int = require('./int');

var _unsignedInt = require('./unsigned-int');

var _util = require('./util');

var _ioMixin = require('./io-mixin');

var _ioMixin2 = _interopRequireDefault(_ioMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var String = exports.String = function () {
  function String() {
    var maxLength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _unsignedInt.UnsignedInt.MAX_VALUE;

    _classCallCheck(this, String);

    this._maxLength = maxLength;
  }

  _createClass(String, [{
    key: 'read',
    value: function read(io) {
      var length = _int.Int.read(io);

      if (length > this._maxLength) {
        throw new Error('XDR Read Error: Saw ' + length + ' length String,' + ('max allowed is ' + this._maxLength));
      }
      var padding = (0, _util.calculatePadding)(length);
      var result = io.slice(length);
      (0, _util.slicePadding)(io, padding);
      return result.buffer();
    }
  }, {
    key: 'readString',
    value: function readString(io) {
      return this.read(io).toString('utf8');
    }
  }, {
    key: 'write',
    value: function write(value, io) {
      if (value.length > this._maxLength) {
        throw new Error('XDR Write Error: Got ' + value.length + ' bytes,' + ('max allows is ' + this._maxLength));
      }

      var buffer = void 0;
      if ((0, _isString2.default)(value)) {
        buffer = Buffer.from(value, 'utf8');
      } else {
        buffer = Buffer.from(value);
      }

      _int.Int.write(buffer.length, io);
      io.writeBufferPadded(buffer);
    }
  }, {
    key: 'isValid',
    value: function isValid(value) {
      var buffer = void 0;
      if ((0, _isString2.default)(value)) {
        buffer = Buffer.from(value, 'utf8');
      } else if ((0, _isArray2.default)(value) || Buffer.isBuffer(value)) {
        buffer = Buffer.from(value);
      } else {
        return false;
      }
      return buffer.length <= this._maxLength;
    }
  }]);

  return String;
}();

(0, _ioMixin2.default)(String.prototype);