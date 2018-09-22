/**
 * @fileoverview Rule to check if the expression could be better expressed as a chain
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var getDocsUrl = require('../util/getDocsUrl');

module.exports = {
    meta: {
        docs: {
            url: getDocsUrl('chaining')
        },
        schema: [{
            enum: ['always', 'never']
        }, {
            type: 'integer',
            minimum: 2
        }]
    },

    create: function create(context) {
        var _require = require('../util/lodashUtil'),
            getLodashContext = _require.getLodashContext,
            isChainBreaker = _require.isChainBreaker;

        var _require2 = require('../util/astUtil'),
            getCaller = _require2.getCaller,
            isMethodCall = _require2.isMethodCall,
            isObjectOfMethodCall = _require2.isObjectOfMethodCall;

        var DEFAULT_LENGTH = 3;
        var lodashContext = getLodashContext(context);
        var version = lodashContext.version;
        var negate = require('lodash/negate');

        var mode = context.options[0] || 'never';
        var ruleDepth = parseInt(context.options[1], 10) || DEFAULT_LENGTH;

        var isEndOfChain = negate(isObjectOfMethodCall);

        function isBeforeChainBreaker(node) {
            return isChainBreaker(node.parent.parent, version);
        }

        function isNestedNLevels(node, n) {
            if (n === 0) {
                return true;
            } else if (lodashContext.isLodashCall(node) || lodashContext.getImportedLodashMethod(node)) {
                return isNestedNLevels(node.arguments[0], n - 1);
            }
        }

        var callExpressionVisitors = {
            always: function always(node) {
                if (isNestedNLevels(node, ruleDepth)) {
                    context.report({ node: node, message: 'Prefer chaining to composition' });
                } else if (lodashContext.isLodashChainStart(node)) {
                    var firstCall = node.parent.parent;
                    if (isMethodCall(firstCall) && (isEndOfChain(firstCall) || isBeforeChainBreaker(firstCall))) {
                        context.report({ node: firstCall, message: 'Do not use chain syntax for single method' });
                    }
                }
            },
            never: function never(node) {
                if (lodashContext.isLodashChainStart(node)) {
                    context.report({ node: node, message: 'Prefer composition to Lodash chaining' });
                }
            }
        };

        var visitors = lodashContext.getImportVisitors();
        visitors.CallExpression = callExpressionVisitors[mode];
        return visitors;
    }
};