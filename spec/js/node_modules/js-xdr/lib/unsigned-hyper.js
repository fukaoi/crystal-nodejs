'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UnsignedHyper = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _long = require('long');

var _long2 = _interopRequireDefault(_long);

var _ioMixin = require('./io-mixin');

var _ioMixin2 = _interopRequireDefault(_ioMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UnsignedHyper = exports.UnsignedHyper = function (_Long) {
  _inherits(UnsignedHyper, _Long);

  _createClass(UnsignedHyper, null, [{
    key: 'read',
    value: function read(io) {
      var high = io.readInt32BE();
      var low = io.readInt32BE();
      return this.fromBits(low, high);
    }
  }, {
    key: 'write',
    value: function write(value, io) {
      if (!(value instanceof this)) {
        throw new Error('XDR Write Error: ' + value + ' is not an UnsignedHyper');
      }

      io.writeInt32BE(value.high);
      io.writeInt32BE(value.low);
    }
  }, {
    key: 'fromString',
    value: function fromString(string) {
      if (!/^\d+$/.test(string)) {
        throw new Error('Invalid hyper string: ' + string);
      }
      var result = _get(UnsignedHyper.__proto__ || Object.getPrototypeOf(UnsignedHyper), 'fromString', this).call(this, string, true);
      return new this(result.low, result.high);
    }
  }, {
    key: 'fromBits',
    value: function fromBits(low, high) {
      var result = _get(UnsignedHyper.__proto__ || Object.getPrototypeOf(UnsignedHyper), 'fromBits', this).call(this, low, high, true);
      return new this(result.low, result.high);
    }
  }, {
    key: 'isValid',
    value: function isValid(value) {
      return value instanceof this;
    }
  }]);

  function UnsignedHyper(low, high) {
    _classCallCheck(this, UnsignedHyper);

    return _possibleConstructorReturn(this, (UnsignedHyper.__proto__ || Object.getPrototypeOf(UnsignedHyper)).call(this, low, high, true));
  }

  return UnsignedHyper;
}(_long2.default);

(0, _ioMixin2.default)(UnsignedHyper);

UnsignedHyper.MAX_VALUE = new UnsignedHyper(_long2.default.MAX_UNSIGNED_VALUE.low, _long2.default.MAX_UNSIGNED_VALUE.high);

UnsignedHyper.MIN_VALUE = new UnsignedHyper(_long2.default.MIN_VALUE.low, _long2.default.MIN_VALUE.high);