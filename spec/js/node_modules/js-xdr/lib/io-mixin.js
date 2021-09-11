'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = includeIoMixin;

var _extend = require('lodash/extend');

var _extend2 = _interopRequireDefault(_extend);

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _cursor = require('./cursor');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: build a system to grow a buffer as we write to it
var BUFFER_SIZE = Math.pow(2, 16);

var staticMethods = {
  toXDR: function toXDR(val) {
    var cursor = new _cursor.Cursor(BUFFER_SIZE);
    this.write(val, cursor);
    var bytesWritten = cursor.tell();
    cursor.rewind();

    return cursor.slice(bytesWritten).buffer();
  },
  fromXDR: function fromXDR(input) {
    var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'raw';

    var buffer = void 0;
    switch (format) {
      case 'raw':
        buffer = input;
        break;
      case 'hex':
        buffer = Buffer.from(input, 'hex');
        break;
      case 'base64':
        buffer = Buffer.from(input, 'base64');
        break;
      default:
        throw new Error('Invalid format ' + format + ', must be "raw", "hex", "base64"');
    }

    var cursor = new _cursor.Cursor(buffer);
    var result = this.read(cursor);

    // TODO: error out if the entire buffer isn't consumed

    return result;
  },
  validateXDR: function validateXDR(input) {
    var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'raw';

    try {
      this.fromXDR(input, format);
      return true;
    } catch (e) {
      return false;
    }
  }
};

var instanceMethods = {
  toXDR: function toXDR() {
    var format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'raw';

    var buffer = this.constructor.toXDR(this);
    switch (format) {
      case 'raw':
        return buffer;
      case 'hex':
        return buffer.toString('hex');
      case 'base64':
        return buffer.toString('base64');
      default:
        throw new Error('Invalid format ' + format + ', must be "raw", "hex", "base64"');
    }
  }
};

function includeIoMixin(obj) {
  (0, _extend2.default)(obj, staticMethods);

  if ((0, _isFunction2.default)(obj)) {
    (0, _extend2.default)(obj.prototype, instanceMethods);
  }
}