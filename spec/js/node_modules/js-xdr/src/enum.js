import each from 'lodash/each';
import vals from 'lodash/values';
import { Int } from './int';
import includeIoMixin from './io-mixin';

export class Enum {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }

  static read(io) {
    const intVal = Int.read(io);

    if (!this._byValue.has(intVal)) {
      throw new Error(
        `XDR Read Error: Unknown ${this.enumName} member for value ${intVal}`
      );
    }

    return this._byValue.get(intVal);
  }

  static write(value, io) {
    if (!(value instanceof this)) {
      throw new Error(
        `XDR Write Error: Unknown ${value} is not a ${this.enumName}`
      );
    }

    Int.write(value.value, io);
  }

  static isValid(value) {
    return value instanceof this;
  }

  static members() {
    return this._members;
  }

  static values() {
    return vals(this._members);
  }

  static fromName(name) {
    const result = this._members[name];

    if (!result) {
      throw new Error(`${name} is not a member of ${this.enumName}`);
    }

    return result;
  }

  static fromValue(value) {
    const result = this._byValue.get(value);

    if (!result) {
      throw new Error(
        `${value} is not a value of any member of ${this.enumName}`
      );
    }

    return result;
  }

  static create(context, name, members) {
    const ChildEnum = class extends Enum {};

    ChildEnum.enumName = name;
    context.results[name] = ChildEnum;

    ChildEnum._members = {};
    ChildEnum._byValue = new Map();

    each(members, (value, key) => {
      const inst = new ChildEnum(key, value);
      ChildEnum._members[key] = inst;
      ChildEnum._byValue.set(value, inst);
      ChildEnum[key] = () => inst;
    });

    return ChildEnum;
  }
}

includeIoMixin(Enum);
