/**
 * @fileoverview Rule to make sure value() wasn't called on a lodash chain twice
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

var getDocsUrl = require('../util/getDocsUrl');

module.exports = {
    meta: {
        docs: {
            url: getDocsUrl('no-double-unwrap')
        },
        fixable: "code"
    },

    create: function create(context) {
        var _require = require('../util/lodashUtil'),
            getLodashContext = _require.getLodashContext,
            isChainBreaker = _require.isChainBreaker,
            isChainable = _require.isChainable;

        var _require2 = require('../util/astUtil'),
            isMethodCall = _require2.isMethodCall,
            getCaller = _require2.getCaller,
            getMethodName = _require2.getMethodName;

        var lodashContext = getLodashContext(context);
        var version = lodashContext.version;
        var visitors = lodashContext.getImportVisitors();
        visitors.CallExpression = function (node) {
            if (lodashContext.isImplicitChainStart(node)) {
                do {
                    node = node.parent.parent;
                } while (isMethodCall(node) && !isChainBreaker(node, version));
                var caller = getCaller(node);
                if (isMethodCall(node) && !isChainable(caller, version)) {
                    context.report({
                        node: node,
                        message: 'Do not use .value() after chain-ending method {{method}}',
                        data: { method: getMethodName(caller) },
                        fix: function fix(fixer) {
                            return fixer.removeRange([caller.range[1], node.range[1]]);
                        }
                    });
                }
            }
        };
        return visitors;
    }
};