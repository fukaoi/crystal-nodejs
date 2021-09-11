import isString from 'lodash/isString';
import isArray from 'lodash/isArray';
import { Int } from './int';
import { UnsignedInt } from './unsigned-int';
import { calculatePadding, slicePadding } from './util';
import includeIoMixin from './io-mixin';

export class String {
  constructor(maxLength = UnsignedInt.MAX_VALUE) {
    this._maxLength = maxLength;
  }

  read(io) {
    const length = Int.read(io);

    if (length > this._maxLength) {
      throw new Error(
        `XDR Read Error: Saw ${length} length String,` +
          `max allowed is ${this._maxLength}`
      );
    }
    const padding = calculatePadding(length);
    const result = io.slice(length);
    slicePadding(io, padding);
    return result.buffer();
  }

  readString(io) {
    return this.read(io).toString('utf8');
  }

  write(value, io) {
    if (value.length > this._maxLength) {
      throw new Error(
        `XDR Write Error: Got ${value.length} bytes,` +
          `max allows is ${this._maxLength}`
      );
    }

    let buffer;
    if (isString(value)) {
      buffer = Buffer.from(value, 'utf8');
    } else {
      buffer = Buffer.from(value);
    }

    Int.write(buffer.length, io);
    io.writeBufferPadded(buffer);
  }

  isValid(value) {
    let buffer;
    if (isString(value)) {
      buffer = Buffer.from(value, 'utf8');
    } else if (isArray(value) || Buffer.isBuffer(value)) {
      buffer = Buffer.from(value);
    } else {
      return false;
    }
    return buffer.length <= this._maxLength;
  }
}

includeIoMixin(String.prototype);
