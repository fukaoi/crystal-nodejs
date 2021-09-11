import every from 'lodash/every';

export function calculatePadding(length) {
  switch (length % 4) {
    case 0:
      return 0;
    case 1:
      return 3;
    case 2:
      return 2;
    case 3:
      return 1;
    default:
      return null;
  }
}
export function slicePadding(io, length) {
  const padding = io.slice(length);
  const allZero = every(padding.buffer(), (byte) => byte === 0);

  if (allZero !== true) {
    throw new Error(`XDR Read Error: invalid padding`);
  }
}
