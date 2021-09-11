'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.beginSponsoringFutureReserves = beginSponsoringFutureReserves;

var _stellarXdr_generated = require('../generated/stellar-xdr_generated');

var _stellarXdr_generated2 = _interopRequireDefault(_stellarXdr_generated);

var _strkey = require('../strkey');

var _keypair = require('../keypair');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create a "begin sponsoring future reserves" operation.
 * @function
 * @alias Operation.beginSponsoringFutureReserves
 * @param {object} opts Options object
 * @param {string} opts.sponsoredId - The sponsored account id.
 * @param {string} [opts.source] - The source account for the operation. Defaults to the transaction's source account.
 * @returns {xdr.Operation} xdr operation
 *
 * @example
 * const op = Operation.beginSponsoringFutureReserves({
 *   sponsoredId: 'GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7'
 * });
 *
 */
function beginSponsoringFutureReserves() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (!_strkey.StrKey.isValidEd25519PublicKey(opts.sponsoredId)) {
    throw new Error('sponsoredId is invalid');
  }
  var op = new _stellarXdr_generated2.default.BeginSponsoringFutureReservesOp({
    sponsoredId: _keypair.Keypair.fromPublicKey(opts.sponsoredId).xdrAccountId()
  });

  var opAttributes = {};
  opAttributes.body = _stellarXdr_generated2.default.OperationBody.beginSponsoringFutureReserves(op);
  this.setSourceAccount(opAttributes, opts);

  return new _stellarXdr_generated2.default.Operation(opAttributes);
}