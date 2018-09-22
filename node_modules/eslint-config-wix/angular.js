'use strict';
var path = require('path');

module.exports = {
  extends: path.join(__dirname, 'index.js'),
  parserOptions: {
    sourceType: 'script'
  },
  env: {
    jasmine: true,
    browser: true,
    node: false
  },
  globals: {
    angular: false,
    inject: false,
    module: false
  }
};
