'use strict';
var path = require('path');

module.exports = {
  extends: [
    'xo/esnext',
    path.join(__dirname, 'index.js')
  ]
};
