const RuleTester = require('eslint').RuleTester;
const ruleTester = new RuleTester();
const rule = require('../../lib/rules/no_disable_yellow_box');

ruleTester.run(
    'react-native-wix/no_disable_yellow_box',
    rule, {
      valid: [
        {code: "console.disableYellowBox = false"}
      ],
      invalid: [
        {
          code: 'console.disableYellowBox = true',
          errors: [
            {line: 1, column: 1, message: 'Never commit console.disableYellowBox = true.'}]
        }
      ]
    }
);
