'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Struct = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _each = require('lodash/each');

var _each2 = _interopRequireDefault(_each);

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

var _isUndefined = require('lodash/isUndefined');

var _isUndefined2 = _interopRequireDefault(_isUndefined);

var _fromPairs = require('lodash/fromPairs');

var _fromPairs2 = _interopRequireDefault(_fromPairs);

var _reference = require('./reference');

var _ioMixin = require('./io-mixin');

var _ioMixin2 = _interopRequireDefault(_ioMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Struct = exports.Struct = function () {
  function Struct(attributes) {
    _classCallCheck(this, Struct);

    this._attributes = attributes || {};
  }

  _createClass(Struct, null, [{
    key: 'read',
    value: function read(io) {
      var fields = (0, _map2.default)(this._fields, function (field) {
        var _field = _slicedToArray(field, 2),
            name = _field[0],
            type = _field[1];

        var value = type.read(io);
        return [name, value];
      });

      return new this((0, _fromPairs2.default)(fields));
    }
  }, {
    key: 'write',
    value: function write(value, io) {
      if (!(value instanceof this)) {
        throw new Error('XDR Write Error: ' + value + ' is not a ' + this.structName);
      }
      (0, _each2.default)(this._fields, function (field) {
        var _field2 = _slicedToArray(field, 2),
            name = _field2[0],
            type = _field2[1];

        var attribute = value._attributes[name];
        type.write(attribute, io);
      });
    }
  }, {
    key: 'isValid',
    value: function isValid(value) {
      return value instanceof this;
    }
  }, {
    key: 'create',
    value: function create(context, name, fields) {
      var ChildStruct = function (_Struct) {
        _inherits(ChildStruct, _Struct);

        function ChildStruct() {
          _classCallCheck(this, ChildStruct);

          return _possibleConstructorReturn(this, (ChildStruct.__proto__ || Object.getPrototypeOf(ChildStruct)).apply(this, arguments));
        }

        return ChildStruct;
      }(Struct);

      ChildStruct.structName = name;

      context.results[name] = ChildStruct;

      ChildStruct._fields = fields.map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            fieldName = _ref2[0],
            field = _ref2[1];

        if (field instanceof _reference.Reference) {
          field = field.resolve(context);
        }

        return [fieldName, field];
      });

      (0, _each2.default)(ChildStruct._fields, function (field) {
        var _field3 = _slicedToArray(field, 1),
            fieldName = _field3[0];

        ChildStruct.prototype[fieldName] = getReadOrWriteAttribute(fieldName);
      });

      return ChildStruct;
    }
  }]);

  return Struct;
}();

(0, _ioMixin2.default)(Struct);

function getReadOrWriteAttribute(name) {
  return function readOrWriteAttribute(value) {
    if (!(0, _isUndefined2.default)(value)) {
      this._attributes[name] = value;
    }

    return this._attributes[name];
  };
}