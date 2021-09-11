import includeIoMixin from './io-mixin';

export const Quadruple = {
  /* jshint unused: false */

  read() {
    throw new Error('XDR Read Error: quadruple not supported');
  },

  write() {
    throw new Error('XDR Write Error: quadruple not supported');
  },

  isValid() {
    return false;
  }
};

includeIoMixin(Quadruple);
