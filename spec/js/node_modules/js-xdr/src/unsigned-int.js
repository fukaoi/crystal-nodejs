import isNumber from 'lodash/isNumber';
import includeIoMixin from './io-mixin';

export const UnsignedInt = {
  read(io) {
    return io.readUInt32BE();
  },

  write(value, io) {
    if (!isNumber(value)) {
      throw new Error('XDR Write Error: not a number');
    }

    if (Math.floor(value) !== value) {
      throw new Error('XDR Write Error: not an integer');
    }

    if (value < 0) {
      throw new Error(`XDR Write Error: negative number ${value}`);
    }

    io.writeUInt32BE(value);
  },

  isValid(value) {
    if (!isNumber(value)) {
      return false;
    }
    if (Math.floor(value) !== value) {
      return false;
    }

    return value >= UnsignedInt.MIN_VALUE && value <= UnsignedInt.MAX_VALUE;
  }
};

UnsignedInt.MAX_VALUE = Math.pow(2, 32) - 1;
UnsignedInt.MIN_VALUE = 0;

includeIoMixin(UnsignedInt);
