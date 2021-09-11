let Opaque = XDR.Opaque;
import { Cursor } from '../../src/cursor';
import { cursorToArray } from '../support/io-helpers';

let subject = new Opaque(3);

describe('Opaque#read', function() {
  it('decodes correctly', function() {
    expect(read([0, 0, 0, 0])).to.eql(Buffer.from([0, 0, 0]));
    expect(read([0, 0, 1, 0])).to.eql(Buffer.from([0, 0, 1]));
  });

  it('throws a read error if the padding bytes are not zero', function() {
    expect(() => read([0, 0, 1, 1])).to.throw(/read error/i);
  });

  function read(bytes) {
    let io = new Cursor(bytes);
    return subject.read(io);
  }
});

describe('Opaque#write', function() {
  it('encodes correctly', function() {
    expect(write(Buffer.from([0, 0, 0]))).to.eql([0, 0, 0, 0]);
    expect(write(Buffer.from([0, 0, 1]))).to.eql([0, 0, 1, 0]);
  });

  function write(value) {
    let io = new Cursor(8);
    subject.write(value, io);
    return cursorToArray(io);
  }
});

describe('Opaque#isValid', function() {
  it('returns true for buffers of the correct length', function() {
    expect(subject.isValid(Buffer.alloc(3))).to.be.true;
  });

  it('returns false for buffers of the wrong size', function() {
    expect(subject.isValid(Buffer.alloc(2))).to.be.false;
    expect(subject.isValid(Buffer.alloc(4))).to.be.false;
  });

  it('returns false for non buffers', function() {
    expect(subject.isValid(true)).to.be.false;
    expect(subject.isValid(null)).to.be.false;
    expect(subject.isValid(3)).to.be.false;
    expect(subject.isValid([0])).to.be.false;
  });
});
