'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Claimant = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _stellarXdr_generated = require('./generated/stellar-xdr_generated');

var _stellarXdr_generated2 = _interopRequireDefault(_stellarXdr_generated);

var _keypair = require('./keypair');

var _strkey = require('./strkey');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Claimant class represents an xdr.Claimant
 *
 * The claim predicate is optional, it defaults to unconditional if none is specified.
 *
 * @constructor
 * @param {string} destination - The destination account ID.
 * @param {xdr.ClaimPredicate} [predicate] - The claim predicate.
 */
var Claimant = exports.Claimant = function () {
  function Claimant(destination, predicate) {
    _classCallCheck(this, Claimant);

    if (destination && !_strkey.StrKey.isValidEd25519PublicKey(destination)) {
      throw new Error('Destination is invalid');
    }
    this._destination = destination;

    if (!predicate) {
      this._predicate = _stellarXdr_generated2.default.ClaimPredicate.claimPredicateUnconditional();
    } else if (predicate instanceof _stellarXdr_generated2.default.ClaimPredicate) {
      this._predicate = predicate;
    } else {
      throw new Error('Predicate should be an xdr.ClaimPredicate');
    }
  }

  /**
   * Returns an unconditional claim predicate
   * @Return {xdr.ClaimPredicate}
   */


  _createClass(Claimant, [{
    key: 'toXDRObject',


    /**
     * Returns the xdr object for this claimant.
     * @returns {xdr.Claimant} XDR Claimant object
     */
    value: function toXDRObject() {
      var claimant = new _stellarXdr_generated2.default.ClaimantV0({
        destination: _keypair.Keypair.fromPublicKey(this._destination).xdrAccountId(),
        predicate: this._predicate
      });

      return _stellarXdr_generated2.default.Claimant.claimantTypeV0(claimant);
    }

    /**
     * @type {string}
     * @readonly
     */

  }, {
    key: 'destination',
    get: function get() {
      return this._destination;
    },
    set: function set(value) {
      throw new Error('Claimant is immutable');
    }

    /**
     * @type {xdr.ClaimPredicate}
     * @readonly
     */

  }, {
    key: 'predicate',
    get: function get() {
      return this._predicate;
    },
    set: function set(value) {
      throw new Error('Claimant is immutable');
    }
  }], [{
    key: 'predicateUnconditional',
    value: function predicateUnconditional() {
      return _stellarXdr_generated2.default.ClaimPredicate.claimPredicateUnconditional();
    }

    /**
     * Returns an `and` claim predicate
     * @param {xdr.ClaimPredicate} left an xdr.ClaimPredicate
     * @param {xdr.ClaimPredicate} right an xdr.ClaimPredicate
     * @Return {xdr.ClaimPredicate}
     */

  }, {
    key: 'predicateAnd',
    value: function predicateAnd(left, right) {
      if (!(left instanceof _stellarXdr_generated2.default.ClaimPredicate)) {
        throw new Error('left Predicate should be an xdr.ClaimPredicate');
      }
      if (!(right instanceof _stellarXdr_generated2.default.ClaimPredicate)) {
        throw new Error('right Predicate should be an xdr.ClaimPredicate');
      }

      return _stellarXdr_generated2.default.ClaimPredicate.claimPredicateAnd([left, right]);
    }

    /**
     * Returns an `or` claim predicate
     * @param {xdr.ClaimPredicate} left an xdr.ClaimPredicate
     * @param {xdr.ClaimPredicate} right an xdr.ClaimPredicate
     * @Return {xdr.ClaimPredicate}
     */

  }, {
    key: 'predicateOr',
    value: function predicateOr(left, right) {
      if (!(left instanceof _stellarXdr_generated2.default.ClaimPredicate)) {
        throw new Error('left Predicate should be an xdr.ClaimPredicate');
      }
      if (!(right instanceof _stellarXdr_generated2.default.ClaimPredicate)) {
        throw new Error('right Predicate should be an xdr.ClaimPredicate');
      }

      return _stellarXdr_generated2.default.ClaimPredicate.claimPredicateOr([left, right]);
    }

    /**
     * Returns a `not` claim predicate
     * @param {xdr.ClaimPredicate} predicate an xdr.ClaimPredicate
     * @Return {xdr.ClaimPredicate}
     */

  }, {
    key: 'predicateNot',
    value: function predicateNot(predicate) {
      if (!(predicate instanceof _stellarXdr_generated2.default.ClaimPredicate)) {
        throw new Error('right Predicate should be an xdr.ClaimPredicate');
      }

      return _stellarXdr_generated2.default.ClaimPredicate.claimPredicateNot(predicate);
    }

    /**
     * Returns a `BeforeAbsoluteTime` claim predicate
     *
     * This predicate will be fulfilled if the closing time of the ledger that
     * includes the CreateClaimableBalance operation is less than this (absolute)
     * Unix timestamp (expressed in seconds).
     *
     * @param {string} absBefore Unix epoch (in seconds) as a string
     * @Return {xdr.ClaimPredicate}
     */

  }, {
    key: 'predicateBeforeAbsoluteTime',
    value: function predicateBeforeAbsoluteTime(absBefore) {
      return _stellarXdr_generated2.default.ClaimPredicate.claimPredicateBeforeAbsoluteTime(_stellarXdr_generated2.default.Int64.fromString(absBefore));
    }

    /**
     * Returns a `BeforeRelativeTime` claim predicate
     *
     * This predicate will be fulfilled if the closing time of the ledger that
     * includes the CreateClaimableBalance operation plus this relative time delta
     * (in seconds) is less than the current time.
     *
     * @param {strings} seconds seconds since closeTime of the ledger in which the ClaimableBalanceEntry was created (as string)
     * @Return {xdr.ClaimPredicate}
     */

  }, {
    key: 'predicateBeforeRelativeTime',
    value: function predicateBeforeRelativeTime(seconds) {
      return _stellarXdr_generated2.default.ClaimPredicate.claimPredicateBeforeRelativeTime(_stellarXdr_generated2.default.Int64.fromString(seconds));
    }

    /**
     * Returns a claimant object from its XDR object representation.
     * @param {xdr.Claimant} claimantXdr - The claimant xdr object.
     * @returns {Claimant}
     */

  }, {
    key: 'fromXDR',
    value: function fromXDR(claimantXdr) {
      var value = void 0;
      switch (claimantXdr.switch()) {
        case _stellarXdr_generated2.default.ClaimantType.claimantTypeV0():
          value = claimantXdr.v0();
          return new this(_strkey.StrKey.encodeEd25519PublicKey(value.destination().ed25519()), value.predicate());
        default:
          throw new Error('Invalid claimant type: ' + claimantXdr.switch().name);
      }
    }
  }]);

  return Claimant;
}();