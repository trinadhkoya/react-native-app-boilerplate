/**
 * @fileoverview Rule to check if there's a method in the chain start that can be in the chain
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var getDocsUrl = require('../util/getDocsUrl');

module.exports = {
    meta: {
        docs: {
            url: getDocsUrl('prefer-lodash-typecheck')
        }
    },

    create: function create(context) {
        var some = require('lodash/some');

        var _require = require('../util/lodashUtil'),
            getIsTypeMethod = _require.getIsTypeMethod;

        var otherSides = {
            left: 'right',
            right: 'left'
        };

        function isTypeOf(node) {
            return node && node.type === 'UnaryExpression' && node.operator === 'typeof';
        }

        function isStrictComparison(node) {
            return node.operator === '===' || node.operator === '!==';
        }

        function isDeclaredVariable(node) {
            var definedVariables = context.getScope().variables;
            return some(definedVariables, { name: node.name });
        }

        function getValueForSide(node, side) {
            var otherSide = otherSides[side];
            if (isTypeOf(node[side]) && (node[otherSide].value !== 'undefined' || node[side].argument.type !== 'Identifier' || isDeclaredVariable(node[side].argument))) {
                return node[otherSide].value;
            }
        }

        function getTypeofCompareType(node) {
            if (isStrictComparison(node)) {
                return getValueForSide(node, 'left') || getValueForSide(node, 'right');
            }
        }

        var REPORT_MESSAGE = 'Prefer \'_.{{method}}\' over {{actual}}.';

        return {
            BinaryExpression: function BinaryExpression(node) {
                var typeofCompareType = getTypeofCompareType(node);
                if (typeofCompareType) {
                    context.report({
                        node: node,
                        message: REPORT_MESSAGE,
                        data: {
                            method: getIsTypeMethod(typeofCompareType),
                            actual: '\'typeof\' comparison'
                        }
                    });
                } else if (node.operator === 'instanceof') {
                    var lodashEquivalent = getIsTypeMethod(node.right.name);
                    if (node.right.type === 'Identifier' && lodashEquivalent) {
                        context.report({
                            node: node,
                            message: REPORT_MESSAGE,
                            data: { method: lodashEquivalent, actual: '\'instanceof ' + node.right.name + '\'' }
                        });
                    }
                }
            }
        };
    }
};