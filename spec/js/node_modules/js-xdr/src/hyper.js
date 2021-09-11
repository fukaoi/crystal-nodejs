import Long from 'long';
import includeIoMixin from './io-mixin';

export class Hyper extends Long {
  static read(io) {
    const high = io.readInt32BE();
    const low = io.readInt32BE();
    return this.fromBits(low, high);
  }

  static write(value, io) {
    if (!(value instanceof this)) {
      throw new Error(`XDR Write Error: ${value} is not a Hyper`);
    }

    io.writeInt32BE(value.high);
    io.writeInt32BE(value.low);
  }

  static fromString(string) {
    if (!/^-?\d+$/.test(string)) {
      throw new Error(`Invalid hyper string: ${string}`);
    }
    const result = super.fromString(string, false);
    return new this(result.low, result.high);
  }

  static fromBits(low, high) {
    const result = super.fromBits(low, high, false);
    return new this(result.low, result.high);
  }

  static isValid(value) {
    return value instanceof this;
  }

  constructor(low, high) {
    super(low, high, false);
  }
}

includeIoMixin(Hyper);

Hyper.MAX_VALUE = new Hyper(Long.MAX_VALUE.low, Long.MAX_VALUE.high);
Hyper.MIN_VALUE = new Hyper(Long.MIN_VALUE.low, Long.MIN_VALUE.high);
