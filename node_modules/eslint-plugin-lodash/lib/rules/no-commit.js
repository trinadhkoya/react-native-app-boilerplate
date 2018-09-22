/**
 * @fileoverview Rule to disallow using _.prototype.commit.
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var getDocsUrl = require('../util/getDocsUrl');

module.exports = {
    meta: {
        docs: {
            url: getDocsUrl('no-commit')
        }
    },

    create: function create(context) {
        var _require = require('../util/lodashUtil'),
            getLodashContext = _require.getLodashContext,
            isCallToMethod = _require.isCallToMethod;

        var _require2 = require('../util/astUtil'),
            isMethodCall = _require2.isMethodCall;

        var lodashContext = getLodashContext(context);
        var visitors = lodashContext.getImportVisitors();
        visitors.CallExpression = function (node) {
            if (lodashContext.isLodashChainStart(node)) {
                do {
                    node = node.parent.parent;
                } while (isMethodCall(node) && !isCallToMethod(node, lodashContext.version, 'commit'));
                if (isCallToMethod(node, lodashContext.version, 'commit')) {
                    context.report({ node: node, message: 'Do not end chain with commit.' });
                }
            }
        };
        return visitors;
    }
};