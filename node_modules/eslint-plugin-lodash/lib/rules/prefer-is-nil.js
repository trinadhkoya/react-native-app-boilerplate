/**
 * @fileoverview Rule to prefer _.noop over an empty function
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var getDocsUrl = require('../util/getDocsUrl');

module.exports = {
    meta: {
        docs: {
            url: getDocsUrl('prefer-is-nil')
        }
    },

    create: function create(context) {
        var _require = require('../util/astUtil'),
            isNegationExpression = _require.isNegationExpression,
            isEquivalentMemberExp = _require.isEquivalentMemberExp;

        var _require2 = require('../util/lodashUtil'),
            isCallToLodashMethod = _require2.isCallToLodashMethod,
            getLodashContext = _require2.getLodashContext;

        var _ = require('lodash');
        var lodashContext = getLodashContext(context);
        var nilChecks = {
            null: {
                isValue: _.matches({ type: 'Literal', value: null }),
                expressionChecks: [getLodashTypeCheckedBy('isNull'), getValueComparedTo('null')]
            },
            undefined: {
                isValue: _.matches({ type: 'Identifier', name: 'undefined' }),
                expressionChecks: [getLodashTypeCheckedBy('isUndefined'), getValueComparedTo('undefined'), getValueWithTypeofUndefinedComparison]
            }
        };

        function getLodashTypeCheckedBy(typecheck) {
            return function (node) {
                return isCallToLodashMethod(node, typecheck, lodashContext) && node.arguments[0];
            };
        }

        function getValueComparedTo(nil) {
            return function (node, operator) {
                return node.type === 'BinaryExpression' && node.operator === operator && (nilChecks[nil].isValue(node.right) && node.left || nilChecks[nil].isValue(node.left) && node.right);
            };
        }

        var getTypeofArgument = _.cond([[_.matches({ type: 'UnaryExpression', operator: 'typeof' }), _.property('argument')]]);

        var isUndefinedString = _.matches({ type: 'Literal', value: 'undefined' });

        function getValueWithTypeofUndefinedComparison(node, operator) {
            return node.type === 'BinaryExpression' && node.operator === operator && (isUndefinedString(node.right) && getTypeofArgument(node.left) || isUndefinedString(node.left) && getTypeofArgument(node.right));
        }

        function checkExpression(nil, operator, node) {
            return _(nilChecks[nil].expressionChecks).map(function (check) {
                return check(node, operator);
            }).find();
        }

        function checkNegatedExpression(nil, node) {
            return isNegationExpression(node) && checkExpression(nil, '===', node.argument) || checkExpression(nil, '!==', node);
        }

        function isEquivalentExistingExpression(node, leftNil, rightNil) {
            var leftExp = checkExpression(leftNil, '===', node.left);
            return leftExp && isEquivalentMemberExp(leftExp, checkExpression(rightNil, '===', node.right));
        }

        function isEquivalentExistingNegation(node, leftNil, rightNil) {
            var leftExp = checkNegatedExpression(leftNil, node.left);
            return leftExp && isEquivalentMemberExp(leftExp, checkNegatedExpression(rightNil, node.right));
        }

        var visitors = lodashContext.getImportVisitors();
        visitors.LogicalExpression = function (node) {
            if (node.operator === '||') {
                if (isEquivalentExistingExpression(node, 'undefined', 'null') || isEquivalentExistingExpression(node, 'null', 'undefined')) {
                    context.report({ node: node, message: 'Prefer isNil over checking for undefined or null.' });
                }
            } else if (isEquivalentExistingNegation(node, 'undefined', 'null') || isEquivalentExistingNegation(node, 'null', 'undefined')) {
                context.report({ node: node, message: 'Prefer isNil over checking for undefined or null.' });
            }
        };
        return visitors;
    }
};