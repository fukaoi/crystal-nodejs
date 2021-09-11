import { calculatePadding } from './util';

class Cursor {
  constructor(buffer) {
    if (!(buffer instanceof Buffer)) {
      buffer =
        typeof buffer === 'number' ? Buffer.alloc(buffer) : Buffer.from(buffer);
    }

    this._setBuffer(buffer);
    this.rewind();
  }

  _setBuffer(buffer) {
    this._buffer = buffer;
    this.length = buffer.length;
  }

  buffer() {
    return this._buffer;
  }

  tap(cb) {
    cb(this);
    return this;
  }

  clone(newIndex) {
    const c = new this.constructor(this.buffer());
    c.seek(arguments.length === 0 ? this.tell() : newIndex);

    return c;
  }

  tell() {
    return this._index;
  }

  seek(op, index) {
    if (arguments.length === 1) {
      index = op;
      op = '=';
    }

    if (op === '+') {
      this._index += index;
    } else if (op === '-') {
      this._index -= index;
    } else {
      this._index = index;
    }

    return this;
  }

  rewind() {
    return this.seek(0);
  }

  eof() {
    return this.tell() === this.buffer().length;
  }

  write(string, length, encoding) {
    return this.seek(
      '+',
      this.buffer().write(string, this.tell(), length, encoding)
    );
  }

  fill(value, length) {
    if (arguments.length === 1) {
      length = this.buffer().length - this.tell();
    }

    this.buffer().fill(value, this.tell(), this.tell() + length);
    this.seek('+', length);

    return this;
  }

  slice(length) {
    if (arguments.length === 0) {
      length = this.length - this.tell();
    }

    const c = new this.constructor(
      this.buffer().slice(this.tell(), this.tell() + length)
    );
    this.seek('+', length);

    return c;
  }

  copyFrom(source) {
    const buf = source instanceof Buffer ? source : source.buffer();
    buf.copy(this.buffer(), this.tell(), 0, buf.length);
    this.seek('+', buf.length);

    return this;
  }

  concat(list) {
    list.forEach((item, i) => {
      if (item instanceof Cursor) {
        list[i] = item.buffer();
      }
    });

    list.unshift(this.buffer());

    const b = Buffer.concat(list);
    this._setBuffer(b);

    return this;
  }

  toString(encoding, length) {
    if (arguments.length === 0) {
      encoding = 'utf8';
      length = this.buffer().length - this.tell();
    } else if (arguments.length === 1) {
      length = this.buffer().length - this.tell();
    }

    const val = this.buffer().toString(
      encoding,
      this.tell(),
      this.tell() + length
    );
    this.seek('+', length);

    return val;
  }

  writeBufferPadded(buffer) {
    const padding = calculatePadding(buffer.length);
    const paddingBuffer = Buffer.alloc(padding);

    return this.copyFrom(new Cursor(buffer)).copyFrom(
      new Cursor(paddingBuffer)
    );
  }
}

[
  [1, ['readInt8', 'readUInt8']],
  [2, ['readInt16BE', 'readInt16LE', 'readUInt16BE', 'readUInt16LE']],
  [
    4,
    [
      'readInt32BE',
      'readInt32LE',
      'readUInt32BE',
      'readUInt32LE',
      'readFloatBE',
      'readFloatLE'
    ]
  ],
  [8, ['readDoubleBE', 'readDoubleLE']]
].forEach((arr) => {
  arr[1].forEach((method) => {
    Cursor.prototype[method] = function read() {
      const val = this.buffer()[method](this.tell());
      this.seek('+', arr[0]);

      return val;
    };
  });
});

[
  [1, ['writeInt8', 'writeUInt8']],
  [2, ['writeInt16BE', 'writeInt16LE', 'writeUInt16BE', 'writeUInt16LE']],
  [
    4,
    [
      'writeInt32BE',
      'writeInt32LE',
      'writeUInt32BE',
      'writeUInt32LE',
      'writeFloatBE',
      'writeFloatLE'
    ]
  ],
  [8, ['writeDoubleBE', 'writeDoubleLE']]
].forEach((arr) => {
  arr[1].forEach((method) => {
    Cursor.prototype[method] = function write(val) {
      this.buffer()[method](val, this.tell());
      this.seek('+', arr[0]);

      return this;
    };
  });
});

export { Cursor };
