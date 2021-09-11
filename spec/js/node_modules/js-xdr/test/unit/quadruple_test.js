let Quadruple = XDR.Quadruple;
import { Cursor } from '../../src/cursor';
import { cursorToArray } from '../support/io-helpers';

describe('Quadruple.read', function() {
  it('is not supported', function() {
    expect(() => read([0x00, 0x00, 0x00, 0x00])).to.throw(/read error/i);
  });

  function read(bytes) {
    let io = new Cursor(bytes);
    return Quadruple.read(io);
  }
});

describe('Quadruple.write', function() {
  it('is not supported', function() {
    expect(() => write(0.0)).to.throw(/write error/i);
  });

  function write(value) {
    let io = new Cursor(8);
    Quadruple.write(value, io);
    return cursorToArray(io);
  }
});

describe('Quadruple.isValid', function() {
  it('returns false', function() {
    expect(Quadruple.isValid(1.0)).to.be.false;
  });
});
