/**
 * @fileoverview console.disableYellowBox = true can affect a wider scope than intended, and is bad practice to leave in code.
 */
'use strict';

module.exports = context => {
  return {
      AssignmentExpression: node => {
        if ((node.operator === '=') &&
            (node.left.object && node.left.object.name === 'console' && node.left.property && node.left.property.name === 'disableYellowBox') &&
            (node.right.type === 'Literal' && node.right.value === true)) {
          context.report(node, 'Never commit console.disableYellowBox = true.');
        }
      }
    };
};
