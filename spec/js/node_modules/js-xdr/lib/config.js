'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reference = require('./reference');

Object.keys(_reference).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _reference[key];
    }
  });
});
exports.config = config;

var _isUndefined = require('lodash/isUndefined');

var _isUndefined2 = _interopRequireDefault(_isUndefined);

var _each = require('lodash/each');

var _each2 = _interopRequireDefault(_each);

var _types = require('./types');

var XDRTypes = _interopRequireWildcard(_types);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function config(fn) {
  var types = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (fn) {
    var builder = new TypeBuilder(types);
    fn(builder);
    builder.resolve();
  }

  return types;
}

var SimpleReference = function (_Reference) {
  _inherits(SimpleReference, _Reference);

  function SimpleReference(name) {
    _classCallCheck(this, SimpleReference);

    var _this = _possibleConstructorReturn(this, (SimpleReference.__proto__ || Object.getPrototypeOf(SimpleReference)).call(this));

    _this.name = name;
    return _this;
  }

  _createClass(SimpleReference, [{
    key: 'resolve',
    value: function resolve(context) {
      var defn = context.definitions[this.name];
      return defn.resolve(context);
    }
  }]);

  return SimpleReference;
}(_reference.Reference);

var ArrayReference = function (_Reference2) {
  _inherits(ArrayReference, _Reference2);

  function ArrayReference(childReference, length) {
    var variable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    _classCallCheck(this, ArrayReference);

    var _this2 = _possibleConstructorReturn(this, (ArrayReference.__proto__ || Object.getPrototypeOf(ArrayReference)).call(this));

    _this2.childReference = childReference;
    _this2.length = length;
    _this2.variable = variable;
    return _this2;
  }

  _createClass(ArrayReference, [{
    key: 'resolve',
    value: function resolve(context) {
      var resolvedChild = this.childReference;
      var length = this.length;

      if (resolvedChild instanceof _reference.Reference) {
        resolvedChild = resolvedChild.resolve(context);
      }

      if (length instanceof _reference.Reference) {
        length = length.resolve(context);
      }

      if (this.variable) {
        return new XDRTypes.VarArray(resolvedChild, length);
      }
      return new XDRTypes.Array(resolvedChild, length);
    }
  }]);

  return ArrayReference;
}(_reference.Reference);

var OptionReference = function (_Reference3) {
  _inherits(OptionReference, _Reference3);

  function OptionReference(childReference) {
    _classCallCheck(this, OptionReference);

    var _this3 = _possibleConstructorReturn(this, (OptionReference.__proto__ || Object.getPrototypeOf(OptionReference)).call(this));

    _this3.childReference = childReference;
    _this3.name = childReference.name;
    return _this3;
  }

  _createClass(OptionReference, [{
    key: 'resolve',
    value: function resolve(context) {
      var resolvedChild = this.childReference;

      if (resolvedChild instanceof _reference.Reference) {
        resolvedChild = resolvedChild.resolve(context);
      }

      return new XDRTypes.Option(resolvedChild);
    }
  }]);

  return OptionReference;
}(_reference.Reference);

var SizedReference = function (_Reference4) {
  _inherits(SizedReference, _Reference4);

  function SizedReference(sizedType, length) {
    _classCallCheck(this, SizedReference);

    var _this4 = _possibleConstructorReturn(this, (SizedReference.__proto__ || Object.getPrototypeOf(SizedReference)).call(this));

    _this4.sizedType = sizedType;
    _this4.length = length;
    return _this4;
  }

  _createClass(SizedReference, [{
    key: 'resolve',
    value: function resolve(context) {
      var length = this.length;

      if (length instanceof _reference.Reference) {
        length = length.resolve(context);
      }

      return new this.sizedType(length);
    }
  }]);

  return SizedReference;
}(_reference.Reference);

var Definition = function () {
  function Definition(constructor, name, cfg) {
    _classCallCheck(this, Definition);

    this.constructor = constructor;
    this.name = name;
    this.config = cfg;
  }

  // resolve calls the constructor of this definition with the provided context
  // and this definitions config values.  The definitions constructor should
  // populate the final type on `context.results`, and may refer to other
  // definitions through `context.definitions`


  _createClass(Definition, [{
    key: 'resolve',
    value: function resolve(context) {
      if (this.name in context.results) {
        return context.results[this.name];
      }

      return this.constructor(context, this.name, this.config);
    }
  }]);

  return Definition;
}();

// let the reference resoltion system do it's thing
// the "constructor" for a typedef just returns the resolved value


function createTypedef(context, typeName, value) {
  if (value instanceof _reference.Reference) {
    value = value.resolve(context);
  }
  context.results[typeName] = value;
  return value;
}

function createConst(context, name, value) {
  context.results[name] = value;
  return value;
}

var TypeBuilder = function () {
  function TypeBuilder(destination) {
    _classCallCheck(this, TypeBuilder);

    this._destination = destination;
    this._definitions = {};
  }

  _createClass(TypeBuilder, [{
    key: 'enum',
    value: function _enum(name, members) {
      var result = new Definition(XDRTypes.Enum.create, name, members);
      this.define(name, result);
    }
  }, {
    key: 'struct',
    value: function struct(name, members) {
      var result = new Definition(XDRTypes.Struct.create, name, members);
      this.define(name, result);
    }
  }, {
    key: 'union',
    value: function union(name, cfg) {
      var result = new Definition(XDRTypes.Union.create, name, cfg);
      this.define(name, result);
    }
  }, {
    key: 'typedef',
    value: function typedef(name, cfg) {
      var result = new Definition(createTypedef, name, cfg);
      this.define(name, result);
    }
  }, {
    key: 'const',
    value: function _const(name, cfg) {
      var result = new Definition(createConst, name, cfg);
      this.define(name, result);
    }
  }, {
    key: 'void',
    value: function _void() {
      return XDRTypes.Void;
    }
  }, {
    key: 'bool',
    value: function bool() {
      return XDRTypes.Bool;
    }
  }, {
    key: 'int',
    value: function int() {
      return XDRTypes.Int;
    }
  }, {
    key: 'hyper',
    value: function hyper() {
      return XDRTypes.Hyper;
    }
  }, {
    key: 'uint',
    value: function uint() {
      return XDRTypes.UnsignedInt;
    }
  }, {
    key: 'uhyper',
    value: function uhyper() {
      return XDRTypes.UnsignedHyper;
    }
  }, {
    key: 'float',
    value: function float() {
      return XDRTypes.Float;
    }
  }, {
    key: 'double',
    value: function double() {
      return XDRTypes.Double;
    }
  }, {
    key: 'quadruple',
    value: function quadruple() {
      return XDRTypes.Quadruple;
    }
  }, {
    key: 'string',
    value: function string(length) {
      return new SizedReference(XDRTypes.String, length);
    }
  }, {
    key: 'opaque',
    value: function opaque(length) {
      return new SizedReference(XDRTypes.Opaque, length);
    }
  }, {
    key: 'varOpaque',
    value: function varOpaque(length) {
      return new SizedReference(XDRTypes.VarOpaque, length);
    }
  }, {
    key: 'array',
    value: function array(childType, length) {
      return new ArrayReference(childType, length);
    }
  }, {
    key: 'varArray',
    value: function varArray(childType, maxLength) {
      return new ArrayReference(childType, maxLength, true);
    }
  }, {
    key: 'option',
    value: function option(childType) {
      return new OptionReference(childType);
    }
  }, {
    key: 'define',
    value: function define(name, definition) {
      if ((0, _isUndefined2.default)(this._destination[name])) {
        this._definitions[name] = definition;
      } else {
        throw new Error('XDRTypes Error:' + name + ' is already defined');
      }
    }
  }, {
    key: 'lookup',
    value: function lookup(name) {
      return new SimpleReference(name);
    }
  }, {
    key: 'resolve',
    value: function resolve() {
      var _this5 = this;

      (0, _each2.default)(this._definitions, function (defn) {
        defn.resolve({
          definitions: _this5._definitions,
          results: _this5._destination
        });
      });
    }
  }]);

  return TypeBuilder;
}();