import isNumber from 'lodash/isNumber';
import includeIoMixin from './io-mixin';

export const Float = {
  read(io) {
    return io.readFloatBE();
  },

  write(value, io) {
    if (!isNumber(value)) {
      throw new Error('XDR Write Error: not a number');
    }

    io.writeFloatBE(value);
  },

  isValid(value) {
    return isNumber(value);
  }
};

includeIoMixin(Float);
