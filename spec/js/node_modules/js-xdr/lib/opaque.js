'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Opaque = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('./util');

var _ioMixin = require('./io-mixin');

var _ioMixin2 = _interopRequireDefault(_ioMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Opaque = exports.Opaque = function () {
  function Opaque(length) {
    _classCallCheck(this, Opaque);

    this._length = length;
    this._padding = (0, _util.calculatePadding)(length);
  }

  _createClass(Opaque, [{
    key: 'read',
    value: function read(io) {
      var result = io.slice(this._length);
      (0, _util.slicePadding)(io, this._padding);
      return result.buffer();
    }
  }, {
    key: 'write',
    value: function write(value, io) {
      if (value.length !== this._length) {
        throw new Error('XDR Write Error: Got ' + value.length + ' bytes, expected ' + this._length);
      }

      io.writeBufferPadded(value);
    }
  }, {
    key: 'isValid',
    value: function isValid(value) {
      return Buffer.isBuffer(value) && value.length === this._length;
    }
  }]);

  return Opaque;
}();

(0, _ioMixin2.default)(Opaque.prototype);