'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TransactionBase = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _stellarXdr_generated = require('./generated/stellar-xdr_generated');

var _stellarXdr_generated2 = _interopRequireDefault(_stellarXdr_generated);

var _hashing = require('./hashing');

var _keypair = require('./keypair');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @ignore
 */
var TransactionBase = exports.TransactionBase = function () {
  function TransactionBase(tx, signatures, fee, networkPassphrase) {
    _classCallCheck(this, TransactionBase);

    if (typeof networkPassphrase !== 'string') {
      throw new Error('Invalid passphrase provided to Transaction: expected a string but got a ' + (typeof networkPassphrase === 'undefined' ? 'undefined' : _typeof(networkPassphrase)));
    }

    this._networkPassphrase = networkPassphrase;
    this._tx = tx;
    this._signatures = signatures;
    this._fee = fee;
  }

  /**
   * @type {Array.<xdr.DecoratedSignature>}
   * @readonly
   */


  _createClass(TransactionBase, [{
    key: 'sign',


    /**
     * Signs the transaction with the given {@link Keypair}.
     * @param {...Keypair} keypairs Keypairs of signers
     * @returns {void}
     */
    value: function sign() {
      var _this = this;

      var txHash = this.hash();

      for (var _len = arguments.length, keypairs = Array(_len), _key = 0; _key < _len; _key++) {
        keypairs[_key] = arguments[_key];
      }

      keypairs.forEach(function (kp) {
        var sig = kp.signDecorated(txHash);
        _this.signatures.push(sig);
      });
    }

    /**
     * Signs a transaction with the given {@link Keypair}. Useful if someone sends
     * you a transaction XDR for you to sign and return (see
     * [addSignature](#addSignature) for more information).
     *
     * When you get a transaction XDR to sign....
     * - Instantiate a `Transaction` object with the XDR
     * - Use {@link Keypair} to generate a keypair object for your Stellar seed.
     * - Run `getKeypairSignature` with that keypair
     * - Send back the signature along with your publicKey (not your secret seed!)
     *
     * Example:
     * ```javascript
     * // `transactionXDR` is a string from the person generating the transaction
     * const transaction = new Transaction(transactionXDR, networkPassphrase);
     * const keypair = Keypair.fromSecret(myStellarSeed);
     * return transaction.getKeypairSignature(keypair);
     * ```
     *
     * @param {Keypair} keypair Keypair of signer
     * @returns {string} Signature string
     */

  }, {
    key: 'getKeypairSignature',
    value: function getKeypairSignature(keypair) {
      return keypair.sign(this.hash()).toString('base64');
    }

    /**
     * Add a signature to the transaction. Useful when a party wants to pre-sign
     * a transaction but doesn't want to give access to their secret keys.
     * This will also verify whether the signature is valid.
     *
     * Here's how you would use this feature to solicit multiple signatures.
     * - Use `TransactionBuilder` to build a new transaction.
     * - Make sure to set a long enough timeout on that transaction to give your
     * signers enough time to sign!
     * - Once you build the transaction, use `transaction.toXDR()` to get the
     * base64-encoded XDR string.
     * - _Warning!_ Once you've built this transaction, don't submit any other
     * transactions onto your account! Doing so will invalidate this pre-compiled
     * transaction!
     * - Send this XDR string to your other parties. They can use the instructions
     * for [getKeypairSignature](#getKeypairSignature) to sign the transaction.
     * - They should send you back their `publicKey` and the `signature` string
     * from [getKeypairSignature](#getKeypairSignature), both of which you pass to
     * this function.
     *
     * @param {string} publicKey The public key of the signer
     * @param {string} signature The base64 value of the signature XDR
     * @returns {void}
     */

  }, {
    key: 'addSignature',
    value: function addSignature() {
      var publicKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var signature = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      if (!signature || typeof signature !== 'string') {
        throw new Error('Invalid signature');
      }

      if (!publicKey || typeof publicKey !== 'string') {
        throw new Error('Invalid publicKey');
      }

      var keypair = void 0;
      var hint = void 0;
      var signatureBuffer = Buffer.from(signature, 'base64');

      try {
        keypair = _keypair.Keypair.fromPublicKey(publicKey);
        hint = keypair.signatureHint();
      } catch (e) {
        throw new Error('Invalid publicKey');
      }

      if (!keypair.verify(this.hash(), signatureBuffer)) {
        throw new Error('Invalid signature');
      }

      this.signatures.push(new _stellarXdr_generated2.default.DecoratedSignature({
        hint: hint,
        signature: signatureBuffer
      }));
    }

    /**
     * Add `hashX` signer preimage as signature.
     * @param {Buffer|String} preimage Preimage of hash used as signer
     * @returns {void}
     */

  }, {
    key: 'signHashX',
    value: function signHashX(preimage) {
      if (typeof preimage === 'string') {
        preimage = Buffer.from(preimage, 'hex');
      }

      if (preimage.length > 64) {
        throw new Error('preimage cannnot be longer than 64 bytes');
      }

      var signature = preimage;
      var hashX = (0, _hashing.hash)(preimage);
      var hint = hashX.slice(hashX.length - 4);
      this.signatures.push(new _stellarXdr_generated2.default.DecoratedSignature({ hint: hint, signature: signature }));
    }

    /**
     * Returns a hash for this transaction, suitable for signing.
     * @returns {Buffer}
     */

  }, {
    key: 'hash',
    value: function hash() {
      return (0, _hashing.hash)(this.signatureBase());
    }
  }, {
    key: 'signatureBase',
    value: function signatureBase() {
      throw new Error('Implement in subclass');
    }
  }, {
    key: 'toEnvelope',
    value: function toEnvelope() {
      throw new Error('Implement in subclass');
    }

    /**
     * Get the transaction envelope as a base64-encoded string
     * @returns {string} XDR string
     */

  }, {
    key: 'toXDR',
    value: function toXDR() {
      return this.toEnvelope().toXDR().toString('base64');
    }
  }, {
    key: 'signatures',
    get: function get() {
      return this._signatures;
    },
    set: function set(value) {
      throw new Error('Transaction is immutable');
    }
  }, {
    key: 'tx',
    get: function get() {
      return this._tx;
    },
    set: function set(value) {
      throw new Error('Transaction is immutable');
    }

    /**
     * @type {string}
     * @readonly
     */

  }, {
    key: 'fee',
    get: function get() {
      return this._fee;
    },
    set: function set(value) {
      throw new Error('Transaction is immutable');
    }

    /**
     * @type {string}
     * @readonly
     */

  }, {
    key: 'networkPassphrase',
    get: function get() {
      return this._networkPassphrase;
    },
    set: function set(networkPassphrase) {
      this._networkPassphrase = networkPassphrase;
    }
  }]);

  return TransactionBase;
}();