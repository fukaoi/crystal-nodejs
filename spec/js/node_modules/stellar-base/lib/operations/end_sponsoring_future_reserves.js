'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.endSponsoringFutureReserves = endSponsoringFutureReserves;

var _stellarXdr_generated = require('../generated/stellar-xdr_generated');

var _stellarXdr_generated2 = _interopRequireDefault(_stellarXdr_generated);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create an "end sponsoring future reserves" operation.
 * @function
 * @alias Operation.endSponsoringFutureReserves
 * @param {object} opts Options object
 * @param {string} [opts.source] - The source account for the operation. Defaults to the transaction's source account.
 * @returns {xdr.Operation} xdr operation
 *
 * @example
 * const op = Operation.endSponsoringFutureReserves();
 *
 */
function endSponsoringFutureReserves() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var opAttributes = {};
  opAttributes.body = _stellarXdr_generated2.default.OperationBody.endSponsoringFutureReserves();
  this.setSourceAccount(opAttributes, opts);

  return new _stellarXdr_generated2.default.Operation(opAttributes);
}