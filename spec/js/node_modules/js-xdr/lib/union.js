'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Union = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _each = require('lodash/each');

var _each2 = _interopRequireDefault(_each);

var _isUndefined = require('lodash/isUndefined');

var _isUndefined2 = _interopRequireDefault(_isUndefined);

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _void = require('./void');

var _reference = require('./reference');

var _ioMixin = require('./io-mixin');

var _ioMixin2 = _interopRequireDefault(_ioMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Union = exports.Union = function () {
  function Union(aSwitch, value) {
    _classCallCheck(this, Union);

    this.set(aSwitch, value);
  }

  _createClass(Union, [{
    key: 'set',
    value: function set(aSwitch, value) {
      if ((0, _isString2.default)(aSwitch)) {
        aSwitch = this.constructor._switchOn.fromName(aSwitch);
      }

      this._switch = aSwitch;
      this._arm = this.constructor.armForSwitch(this._switch);
      this._armType = this.constructor.armTypeForArm(this._arm);
      this._value = value;
    }
  }, {
    key: 'get',
    value: function get() {
      var armName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._arm;

      if (this._arm !== _void.Void && this._arm !== armName) {
        throw new Error(armName + ' not set');
      }
      return this._value;
    }
  }, {
    key: 'switch',
    value: function _switch() {
      return this._switch;
    }
  }, {
    key: 'arm',
    value: function arm() {
      return this._arm;
    }
  }, {
    key: 'armType',
    value: function armType() {
      return this._armType;
    }
  }, {
    key: 'value',
    value: function value() {
      return this._value;
    }
  }], [{
    key: 'armForSwitch',
    value: function armForSwitch(aSwitch) {
      if (this._switches.has(aSwitch)) {
        return this._switches.get(aSwitch);
      }
      if (this._defaultArm) {
        return this._defaultArm;
      }
      throw new Error('Bad union switch: ' + aSwitch);
    }
  }, {
    key: 'armTypeForArm',
    value: function armTypeForArm(arm) {
      if (arm === _void.Void) {
        return _void.Void;
      }
      return this._arms[arm];
    }
  }, {
    key: 'read',
    value: function read(io) {
      var aSwitch = this._switchOn.read(io);
      var arm = this.armForSwitch(aSwitch);
      var armType = this.armTypeForArm(arm);
      var value = void 0;
      if (!(0, _isUndefined2.default)(armType)) {
        value = armType.read(io);
      } else {
        value = arm.read(io);
      }
      return new this(aSwitch, value);
    }
  }, {
    key: 'write',
    value: function write(value, io) {
      if (!(value instanceof this)) {
        throw new Error('XDR Write Error: ' + value + ' is not a ' + this.unionName);
      }

      this._switchOn.write(value.switch(), io);
      value.armType().write(value.value(), io);
    }
  }, {
    key: 'isValid',
    value: function isValid(value) {
      return value instanceof this;
    }
  }, {
    key: 'create',
    value: function create(context, name, config) {
      var ChildUnion = function (_Union) {
        _inherits(ChildUnion, _Union);

        function ChildUnion() {
          _classCallCheck(this, ChildUnion);

          return _possibleConstructorReturn(this, (ChildUnion.__proto__ || Object.getPrototypeOf(ChildUnion)).apply(this, arguments));
        }

        return ChildUnion;
      }(Union);

      ChildUnion.unionName = name;
      context.results[name] = ChildUnion;

      if (config.switchOn instanceof _reference.Reference) {
        ChildUnion._switchOn = config.switchOn.resolve(context);
      } else {
        ChildUnion._switchOn = config.switchOn;
      }

      ChildUnion._switches = new Map();
      ChildUnion._arms = {};

      (0, _each2.default)(config.arms, function (value, armsName) {
        if (value instanceof _reference.Reference) {
          value = value.resolve(context);
        }

        ChildUnion._arms[armsName] = value;
      });

      // resolve default arm
      var defaultArm = config.defaultArm;
      if (defaultArm instanceof _reference.Reference) {
        defaultArm = defaultArm.resolve(context);
      }

      ChildUnion._defaultArm = defaultArm;

      (0, _each2.default)(config.switches, function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            aSwitch = _ref2[0],
            armName = _ref2[1];

        if ((0, _isString2.default)(aSwitch)) {
          aSwitch = ChildUnion._switchOn.fromName(aSwitch);
        }

        ChildUnion._switches.set(aSwitch, armName);
      });

      // add enum-based helpers
      // NOTE: we don't have good notation for "is a subclass of XDR.Enum",
      //  and so we use the following check (does _switchOn have a `values`
      //  attribute) to approximate the intent.
      if (!(0, _isUndefined2.default)(ChildUnion._switchOn.values)) {
        (0, _each2.default)(ChildUnion._switchOn.values(), function (aSwitch) {
          // Add enum-based constrocutors
          ChildUnion[aSwitch.name] = function (value) {
            return new ChildUnion(aSwitch, value);
          };

          // Add enum-based "set" helpers
          // (note: normally I'd use an arrow function but the use of `this`
          // here might rely on it NOT being an arrow function. so just keep it.)
          ChildUnion.prototype[aSwitch.name] = function set(value) {
            return this.set(aSwitch, value);
          };
        });
      }

      // Add arm accessor helpers
      (0, _each2.default)(ChildUnion._arms, function (type, armsName) {
        if (type === _void.Void) {
          return;
        }

        ChildUnion.prototype[armsName] = function get() {
          return this.get(armsName);
        };
      });

      return ChildUnion;
    }
  }]);

  return Union;
}();

(0, _ioMixin2.default)(Union);