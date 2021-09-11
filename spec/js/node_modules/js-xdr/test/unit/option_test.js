import { Cursor } from '../../src/cursor';
import { cursorToArray } from '../support/io-helpers';

let subject = new XDR.Option(XDR.Int);

describe('Option#read', function() {
  it('decodes correctly', function() {
    expect(read([0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00])).to.eql(0);
    expect(read([0x00, 0x00, 0x00, 0x00])).to.be.undefined;
  });

  function read(bytes) {
    let io = new Cursor(bytes);
    return subject.read(io);
  }
});

describe('Option#write', function() {
  it('encodes correctly', function() {
    expect(write(3)).to.eql([0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x03]);
    expect(write(null)).to.eql([0x00, 0x00, 0x00, 0x00]);
    expect(write(undefined)).to.eql([0x00, 0x00, 0x00, 0x00]);
  });

  function write(value) {
    let io = new Cursor(8);
    subject.write(value, io);
    return cursorToArray(io);
  }
});

describe('Option#isValid', function() {
  it('returns true for values of the correct child type', function() {
    expect(subject.isValid(0)).to.be.true;
    expect(subject.isValid(-1)).to.be.true;
    expect(subject.isValid(1)).to.be.true;
  });

  it('returns true for null and undefined', function() {
    expect(subject.isValid(null)).to.be.true;
    expect(subject.isValid(undefined)).to.be.true;
  });

  it('returns false for values of the wrong type', function() {
    expect(subject.isValid(false)).to.be.false;
    expect(subject.isValid('hello')).to.be.false;
    expect(subject.isValid({})).to.be.false;
  });
});
