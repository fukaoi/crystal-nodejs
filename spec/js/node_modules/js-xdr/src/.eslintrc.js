module.exports = {
  env: {
    es6: true
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier', 'prefer-import'],
  rules: {
    // OFF
    'import/prefer-default-export': 0,
    'node/no-unsupported-features/es-syntax': 0,
    'node/no-unsupported-features/es-builtins': 0,
    camelcase: 0,
    'class-methods-use-this': 0,
    'linebreak-style': 0,
    'new-cap': 0,
    'no-param-reassign': 0,
    'no-underscore-dangle': 0,
    'no-use-before-define': 0,
    'prefer-destructuring': 0,
    'lines-between-class-members': 0,

    // WARN
    'prefer-import/prefer-import-over-require': [1],
    'no-console': ['warn', { allow: ['assert'] }],
    'no-debugger': 1,
    'no-unused-vars': 1,
    'arrow-body-style': 1,
    'valid-jsdoc': [
      1,
      {
        requireReturnDescription: false
      }
    ],
    'prefer-const': 1,
    'object-shorthand': 1,
    'require-await': 1,

    // ERROR
    'no-unused-expressions': [2, { allowTaggedTemplates: true }],

    // we're redefining this without the Math.pow restriction
    // (since we don't want to manually add support for it)
    // copied from https://github.com/airbnb/javascript/blob/070e6200bb6c70fa31470ed7a6294f2497468b44/packages/eslint-config-airbnb-base/rules/best-practices.js#L200
    'no-restricted-properties': [
      'error',
      {
        object: 'arguments',
        property: 'callee',
        message: 'arguments.callee is deprecated'
      },
      {
        object: 'global',
        property: 'isFinite',
        message: 'Please use Number.isFinite instead'
      },
      {
        object: 'self',
        property: 'isFinite',
        message: 'Please use Number.isFinite instead'
      },
      {
        object: 'window',
        property: 'isFinite',
        message: 'Please use Number.isFinite instead'
      },
      {
        object: 'global',
        property: 'isNaN',
        message: 'Please use Number.isNaN instead'
      },
      {
        object: 'self',
        property: 'isNaN',
        message: 'Please use Number.isNaN instead'
      },
      {
        object: 'window',
        property: 'isNaN',
        message: 'Please use Number.isNaN instead'
      },
      {
        property: '__defineGetter__',
        message: 'Please use Object.defineProperty instead.'
      },
      {
        property: '__defineSetter__',
        message: 'Please use Object.defineProperty instead.'
      }
    ]
  },
  parser: 'babel-eslint'
};
