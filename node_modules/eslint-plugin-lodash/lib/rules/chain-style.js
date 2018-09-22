/**
 * @fileoverview Rule to enforce a specific chain style
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var getDocsUrl = require('../util/getDocsUrl');

module.exports = {
    meta: {
        docs: {
            url: getDocsUrl('chain-style')
        },
        schema: [{
            enum: ['as-needed', 'implicit', 'explicit']
        }]
    },

    create: function create(context) {
        var _require = require('../util/lodashUtil'),
            getLodashContext = _require.getLodashContext,
            isChainable = _require.isChainable,
            isChainBreaker = _require.isChainBreaker;

        var _require2 = require('../util/astUtil'),
            isMethodCall = _require2.isMethodCall;

        var lodashContext = getLodashContext(context);
        var version = lodashContext.version;
        var callExpressionVisitors = {
            'as-needed': function asNeeded(node) {
                if (lodashContext.isExplicitChainStart(node)) {
                    var curr = node.parent.parent;
                    var needed = false;
                    while (isMethodCall(curr) && !isChainBreaker(curr, version)) {
                        if (!isChainable(curr, version) && !isChainBreaker(curr.parent.parent, version)) {
                            needed = true;
                        }
                        curr = curr.parent.parent;
                    }
                    if (isMethodCall(curr) && !needed) {
                        context.report({ node: node, message: 'Unnecessary explicit chaining' });
                    }
                }
            },
            implicit: function implicit(node) {
                if (lodashContext.isExplicitChainStart(node)) {
                    context.report({ node: node, message: 'Do not use explicit chaining' });
                }
            },
            explicit: function explicit(node) {
                if (lodashContext.isImplicitChainStart(node)) {
                    context.report({ node: node, message: 'Do not use implicit chaining' });
                }
            }
        };

        var visitors = lodashContext.getImportVisitors();
        visitors.CallExpression = callExpressionVisitors[context.options[0] || 'as-needed'];
        return visitors;
    }
};