/**
 * @fileoverview Rule to check if an "&&" experssion should be a call to _.get or _.has
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var getDocsUrl = require('../util/getDocsUrl');

module.exports = {
    meta: {
        docs: {
            url: getDocsUrl('prefer-get')
        },
        schema: [{
            type: 'integer',
            minimum: 2
        }]
    },

    create: function create(context) {
        var DEFAULT_LENGTH = 3;

        var _require = require('../util/astUtil'),
            isComputed = _require.isComputed,
            isEquivalentMemberExp = _require.isEquivalentMemberExp,
            isEqEqEq = _require.isEqEqEq;

        var ruleDepth = parseInt(context.options[0], 10) || DEFAULT_LENGTH;

        var expStates = [];
        function getState() {
            return expStates[expStates.length - 1] || { depth: 0 };
        }

        function shouldCheckDeeper(node, nodeRight, toCompare) {
            return node.operator === '&&' && nodeRight && nodeRight.type === 'MemberExpression' && !isComputed(nodeRight) && (!toCompare || isEquivalentMemberExp(nodeRight, toCompare));
        }

        return {
            LogicalExpression: function LogicalExpression(node) {
                var state = getState();
                var rightMemberExp = isEqEqEq(node.right) && state.depth === 0 ? node.right.left : node.right;

                if (shouldCheckDeeper(node, rightMemberExp, state.node)) {
                    expStates.push({ depth: state.depth + 1, node: rightMemberExp.object });
                    if (isEquivalentMemberExp(node.left, rightMemberExp.object) && state.depth >= ruleDepth - 2) {
                        context.report({ node: node, message: "Prefer _.get or _.has over an '&&' chain" });
                    }
                }
            },
            'LogicalExpression:exit': function LogicalExpressionExit(node) {
                var state = getState();
                if (state && state.node === node.right.object) {
                    expStates.pop();
                }
            }
        };
    }
};