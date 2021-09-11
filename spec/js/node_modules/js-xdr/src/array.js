import every from 'lodash/every';
import each from 'lodash/each';
import times from 'lodash/times';
import isArray from 'lodash/isArray';
import includeIoMixin from './io-mixin';

export class Array {
  constructor(childType, length) {
    this._childType = childType;
    this._length = length;
  }

  read(io) {
    return times(this._length, () => this._childType.read(io));
  }

  write(value, io) {
    if (!isArray(value)) {
      throw new Error(`XDR Write Error: value is not array`);
    }

    if (value.length !== this._length) {
      throw new Error(
        `XDR Write Error: Got array of size ${value.length},` +
          `expected ${this._length}`
      );
    }

    each(value, (child) => this._childType.write(child, io));
  }

  isValid(value) {
    if (!isArray(value)) {
      return false;
    }
    if (value.length !== this._length) {
      return false;
    }

    return every(value, (child) => this._childType.isValid(child));
  }
}

includeIoMixin(Array.prototype);
