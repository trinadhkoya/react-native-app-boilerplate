const RuleTester = require('eslint').RuleTester;
const ruleTester = new RuleTester();
const rule = require('../../lib/rules/never-device-emitter-remove-all');

ruleTester.run(
  'react-native-wix/never-device-emitter-remove-all',
  rule, {
    valid: [
      {code: "DeviceEventEmitter.addListener('eventType', function(event) {})"}
    ],
    invalid: [
      {
        code: 'DeviceEventEmitter.removeAllListeners()',
        errors: [
          {line: 1, column: 1, message: 'Never use DeviceEventEmitter.removeAllListeners(). Remove specific listeners, instead.'}]
      }
    ]
  }
);
