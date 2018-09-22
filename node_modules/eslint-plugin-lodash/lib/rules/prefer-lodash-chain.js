/**
 * @fileoverview Rule to check if there's a JS native method in the lodash chain
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var getDocsUrl = require('../util/getDocsUrl');

module.exports = {
    meta: {
        docs: {
            url: getDocsUrl('prefer-lodash-chain')
        }
    },

    create: function create(context) {
        var _require = require('../util/lodashUtil'),
            getLodashContext = _require.getLodashContext,
            isChainBreaker = _require.isChainBreaker,
            isNativeCollectionMethodCall = _require.isNativeCollectionMethodCall,
            isLodashWrapperMethod = _require.isLodashWrapperMethod;

        var _require2 = require('../util/astUtil'),
            isMethodCall = _require2.isMethodCall,
            isObjectOfMethodCall = _require2.isObjectOfMethodCall,
            getMethodName = _require2.getMethodName;

        var REPORT_MESSAGE = "Do not break chain before method '{{method}}'.";
        var lodashContext = getLodashContext(context);
        var version = lodashContext.version;

        var visitors = lodashContext.getImportVisitors();
        visitors.CallExpression = function (node) {
            if (lodashContext.isLodashChainStart(node)) {
                do {
                    node = node.parent.parent;
                } while (isMethodCall(node) && !isChainBreaker(node, version));
                if (isChainBreaker(node, version) && isObjectOfMethodCall(node)) {
                    var callAfterChainBreak = node.parent.parent;
                    if (isNativeCollectionMethodCall(callAfterChainBreak) || isLodashWrapperMethod(callAfterChainBreak, version)) {
                        context.report({ node: callAfterChainBreak, message: REPORT_MESSAGE, data: { method: getMethodName(callAfterChainBreak) } });
                    }
                }
            } else if (lodashContext.isLodashCall(node)) {
                if (node.parent.type === 'MemberExpression' && isMethodCall(node.parent.parent) && isNativeCollectionMethodCall(node.parent.parent)) {
                    context.report({ node: node.parent.parent, message: REPORT_MESSAGE, data: { method: getMethodName(node.parent.parent) } });
                }
            }
        };
        return visitors;
    }
};