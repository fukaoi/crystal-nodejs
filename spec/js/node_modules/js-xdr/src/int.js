import isNumber from 'lodash/isNumber';
import includeIoMixin from './io-mixin';

export const Int = {
  read(io) {
    return io.readInt32BE();
  },

  write(value, io) {
    if (!isNumber(value)) {
      throw new Error('XDR Write Error: not a number');
    }

    if (Math.floor(value) !== value) {
      throw new Error('XDR Write Error: not an integer');
    }

    io.writeInt32BE(value);
  },

  isValid(value) {
    if (!isNumber(value)) {
      return false;
    }
    if (Math.floor(value) !== value) {
      return false;
    }

    return value >= Int.MIN_VALUE && value <= Int.MAX_VALUE;
  }
};

Int.MAX_VALUE = Math.pow(2, 31) - 1;
Int.MIN_VALUE = -Math.pow(2, 31);

includeIoMixin(Int);
