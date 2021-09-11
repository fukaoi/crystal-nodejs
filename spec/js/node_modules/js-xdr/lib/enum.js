'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Enum = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _each = require('lodash/each');

var _each2 = _interopRequireDefault(_each);

var _values = require('lodash/values');

var _values2 = _interopRequireDefault(_values);

var _int = require('./int');

var _ioMixin = require('./io-mixin');

var _ioMixin2 = _interopRequireDefault(_ioMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Enum = exports.Enum = function () {
  function Enum(name, value) {
    _classCallCheck(this, Enum);

    this.name = name;
    this.value = value;
  }

  _createClass(Enum, null, [{
    key: 'read',
    value: function read(io) {
      var intVal = _int.Int.read(io);

      if (!this._byValue.has(intVal)) {
        throw new Error('XDR Read Error: Unknown ' + this.enumName + ' member for value ' + intVal);
      }

      return this._byValue.get(intVal);
    }
  }, {
    key: 'write',
    value: function write(value, io) {
      if (!(value instanceof this)) {
        throw new Error('XDR Write Error: Unknown ' + value + ' is not a ' + this.enumName);
      }

      _int.Int.write(value.value, io);
    }
  }, {
    key: 'isValid',
    value: function isValid(value) {
      return value instanceof this;
    }
  }, {
    key: 'members',
    value: function members() {
      return this._members;
    }
  }, {
    key: 'values',
    value: function values() {
      return (0, _values2.default)(this._members);
    }
  }, {
    key: 'fromName',
    value: function fromName(name) {
      var result = this._members[name];

      if (!result) {
        throw new Error(name + ' is not a member of ' + this.enumName);
      }

      return result;
    }
  }, {
    key: 'fromValue',
    value: function fromValue(value) {
      var result = this._byValue.get(value);

      if (!result) {
        throw new Error(value + ' is not a value of any member of ' + this.enumName);
      }

      return result;
    }
  }, {
    key: 'create',
    value: function create(context, name, members) {
      var ChildEnum = function (_Enum) {
        _inherits(ChildEnum, _Enum);

        function ChildEnum() {
          _classCallCheck(this, ChildEnum);

          return _possibleConstructorReturn(this, (ChildEnum.__proto__ || Object.getPrototypeOf(ChildEnum)).apply(this, arguments));
        }

        return ChildEnum;
      }(Enum);

      ChildEnum.enumName = name;
      context.results[name] = ChildEnum;

      ChildEnum._members = {};
      ChildEnum._byValue = new Map();

      (0, _each2.default)(members, function (value, key) {
        var inst = new ChildEnum(key, value);
        ChildEnum._members[key] = inst;
        ChildEnum._byValue.set(value, inst);
        ChildEnum[key] = function () {
          return inst;
        };
      });

      return ChildEnum;
    }
  }]);

  return Enum;
}();

(0, _ioMixin2.default)(Enum);