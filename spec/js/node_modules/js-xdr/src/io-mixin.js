import extend from 'lodash/extend';
import isFunction from 'lodash/isFunction';
import { Cursor } from './cursor';

// TODO: build a system to grow a buffer as we write to it
const BUFFER_SIZE = Math.pow(2, 16);

const staticMethods = {
  toXDR(val) {
    const cursor = new Cursor(BUFFER_SIZE);
    this.write(val, cursor);
    const bytesWritten = cursor.tell();
    cursor.rewind();

    return cursor.slice(bytesWritten).buffer();
  },

  fromXDR(input, format = 'raw') {
    let buffer;
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
        throw new Error(
          `Invalid format ${format}, must be "raw", "hex", "base64"`
        );
    }

    const cursor = new Cursor(buffer);
    const result = this.read(cursor);

    // TODO: error out if the entire buffer isn't consumed

    return result;
  },

  validateXDR(input, format = 'raw') {
    try {
      this.fromXDR(input, format);
      return true;
    } catch (e) {
      return false;
    }
  }
};

const instanceMethods = {
  toXDR(format = 'raw') {
    const buffer = this.constructor.toXDR(this);
    switch (format) {
      case 'raw':
        return buffer;
      case 'hex':
        return buffer.toString('hex');
      case 'base64':
        return buffer.toString('base64');
      default:
        throw new Error(
          `Invalid format ${format}, must be "raw", "hex", "base64"`
        );
    }
  }
};

export default function includeIoMixin(obj) {
  extend(obj, staticMethods);

  if (isFunction(obj)) {
    extend(obj.prototype, instanceMethods);
  }
}
