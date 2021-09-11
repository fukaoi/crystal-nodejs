import each from 'lodash/each';
import isUndefined from 'lodash/isUndefined';
import isString from 'lodash/isString';
import { Void } from './void';
import { Reference } from './reference';
import includeIoMixin from './io-mixin';

export class Union {
  constructor(aSwitch, value) {
    this.set(aSwitch, value);
  }

  set(aSwitch, value) {
    if (isString(aSwitch)) {
      aSwitch = this.constructor._switchOn.fromName(aSwitch);
    }

    this._switch = aSwitch;
    this._arm = this.constructor.armForSwitch(this._switch);
    this._armType = this.constructor.armTypeForArm(this._arm);
    this._value = value;
  }

  get(armName = this._arm) {
    if (this._arm !== Void && this._arm !== armName) {
      throw new Error(`${armName} not set`);
    }
    return this._value;
  }

  switch() {
    return this._switch;
  }

  arm() {
    return this._arm;
  }

  armType() {
    return this._armType;
  }

  value() {
    return this._value;
  }

  static armForSwitch(aSwitch) {
    if (this._switches.has(aSwitch)) {
      return this._switches.get(aSwitch);
    }
    if (this._defaultArm) {
      return this._defaultArm;
    }
    throw new Error(`Bad union switch: ${aSwitch}`);
  }

  static armTypeForArm(arm) {
    if (arm === Void) {
      return Void;
    }
    return this._arms[arm];
  }

  static read(io) {
    const aSwitch = this._switchOn.read(io);
    const arm = this.armForSwitch(aSwitch);
    const armType = this.armTypeForArm(arm);
    let value;
    if (!isUndefined(armType)) {
      value = armType.read(io);
    } else {
      value = arm.read(io);
    }
    return new this(aSwitch, value);
  }

  static write(value, io) {
    if (!(value instanceof this)) {
      throw new Error(`XDR Write Error: ${value} is not a ${this.unionName}`);
    }

    this._switchOn.write(value.switch(), io);
    value.armType().write(value.value(), io);
  }

  static isValid(value) {
    return value instanceof this;
  }

  static create(context, name, config) {
    const ChildUnion = class extends Union {};

    ChildUnion.unionName = name;
    context.results[name] = ChildUnion;

    if (config.switchOn instanceof Reference) {
      ChildUnion._switchOn = config.switchOn.resolve(context);
    } else {
      ChildUnion._switchOn = config.switchOn;
    }

    ChildUnion._switches = new Map();
    ChildUnion._arms = {};

    each(config.arms, (value, armsName) => {
      if (value instanceof Reference) {
        value = value.resolve(context);
      }

      ChildUnion._arms[armsName] = value;
    });

    // resolve default arm
    let defaultArm = config.defaultArm;
    if (defaultArm instanceof Reference) {
      defaultArm = defaultArm.resolve(context);
    }

    ChildUnion._defaultArm = defaultArm;

    each(config.switches, ([aSwitch, armName]) => {
      if (isString(aSwitch)) {
        aSwitch = ChildUnion._switchOn.fromName(aSwitch);
      }

      ChildUnion._switches.set(aSwitch, armName);
    });

    // add enum-based helpers
    // NOTE: we don't have good notation for "is a subclass of XDR.Enum",
    //  and so we use the following check (does _switchOn have a `values`
    //  attribute) to approximate the intent.
    if (!isUndefined(ChildUnion._switchOn.values)) {
      each(ChildUnion._switchOn.values(), (aSwitch) => {
        // Add enum-based constrocutors
        ChildUnion[aSwitch.name] = (value) => new ChildUnion(aSwitch, value);

        // Add enum-based "set" helpers
        // (note: normally I'd use an arrow function but the use of `this`
        // here might rely on it NOT being an arrow function. so just keep it.)
        ChildUnion.prototype[aSwitch.name] = function set(value) {
          return this.set(aSwitch, value);
        };
      });
    }

    // Add arm accessor helpers
    each(ChildUnion._arms, (type, armsName) => {
      if (type === Void) {
        return;
      }

      ChildUnion.prototype[armsName] = function get() {
        return this.get(armsName);
      };
    });

    return ChildUnion;
  }
}

includeIoMixin(Union);
