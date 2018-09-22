'use strict';

module.exports = {
  rules: {
    'never-device-emitter-remove-all': require('./lib/rules/never-device-emitter-remove-all'),
    'no_disable_yellow_box': require('./lib/rules/no_disable_yellow_box')
  },
  configs: {
    recommended: {
      rules: {
        'never-device-emitter-remove-all': 2,
        'no_disable_yellow_box': 2
      }
    }
  }
};
