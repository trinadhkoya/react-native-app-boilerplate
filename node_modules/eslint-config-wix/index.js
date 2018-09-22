'use strict';

module.exports = {
  extends: 'xo',
  env: {
    protractor: true,
    jasmine: true,
    mocha: true
  },
  plugins: ['mocha', 'jasmine'],
  parser: 'babel-eslint',
  rules: {
    strict: 0,
    indent: [2, 2, {
      SwitchCase: 1
    }],
    'no-unused-expressions': 0,
    'no-warning-comments': 0,
    'padded-blocks': 0,
    'no-throw-literal': 0,
    'no-else-return': 0,
    'no-implicit-coercion': [2, {
      boolean: false,
      string: false
    }],
    'spaced-comment': 0,
    'no-multiple-empty-lines': 0,
    'one-var': 0,
    'no-negated-condition': 0,
    'no-return-assign': 0,
    radix: 0,
    'no-implicit-globals': 0,
    'one-var-declaration-per-line': 0,
    'max-nested-callbacks': 0,
    'comma-dangle': [2, 'only-multiline'],
    'quote-props': [2, 'as-needed'],
    'no-bitwise': 2,
    'new-cap': [2, {newIsCapExceptions: ['express']}],
    'max-statements-per-line': ['error', {max: 2}],
    'mocha/no-exclusive-tests': 'error',
    'generator-star-spacing': ['error', 'after'],
    'yield-star-spacing': ['error', 'after']
  }
};
