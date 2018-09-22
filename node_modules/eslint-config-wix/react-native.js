'use strict';
const path = require('path');

module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  extends: [
    'xo/esnext',
    'xo-react/space',
    path.join(__dirname, 'index.js')
  ],
  plugins: [
    'react-native-wix'
  ],
  rules: {
    'no-unused-expressions': 2,
    'arrow-parens': [
      'error',
      'always'
    ],
    'no-unused-vars': [ // unused args in functions are OK
      'error',
      {
        args: 'none'
      }
    ],
    'no-use-before-define': 0, //this breaks in react-native apps because of styles
    'generator-star-spacing': [ // spacing in async functions
      'error',
      'after'
    ],
    'react/jsx-no-bind': [ // bind not allowed in render
      'error',
      {
        allowArrowFunctions: true
      }
    ],
    'react/jsx-closing-bracket-location': [
      'error',
      'tag-aligned'
    ],
    'react/prop-types': 0, //no prop validations
    'react/no-unused-prop-types': 0,
    'react/no-children-prop': 0,
    'react/jsx-handler-names': 0, // any prop name is OK
    'react/forbid-component-props': 0, //no needed in react-native
    'react-native-wix/never-device-emitter-remove-all': 2,
    'react-native-wix/no_disable_yellow_box': 2
  },
  globals: {
    document: false,
    fetch: true,
    __DEV__: true,
    jest: true
  }
};
