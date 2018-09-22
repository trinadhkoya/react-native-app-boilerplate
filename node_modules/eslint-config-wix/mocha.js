'use strict';
var path = require('path');

module.exports = {
  extends: path.join(__dirname, 'esnext.js'),
  env: {
    mocha: true
  },
  plugins: ['mocha'],
  rules: {
    'mocha/no-exclusive-tests': 2,
    'no-unused-expressions': 0
  }
};
