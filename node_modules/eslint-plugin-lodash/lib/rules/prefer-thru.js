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
            url: getDocsUrl('prefer-thru')
        }
    },

    create: function create(context) {
        var _require = require('../util/lodashUtil'),
            getLodashContext = _require.getLodashContext;

        var lodashContext = getLodashContext(context);
        function isSingleArgumentFunctionCall(node) {
            return node && node.type === 'CallExpression' && node.arguments.length === 1 && node.arguments[0].type !== 'Literal';
        }

        var visitors = lodashContext.getImportVisitors();
        visitors.CallExpression = function (node) {
            if (lodashContext.isLodashChainStart(node) && isSingleArgumentFunctionCall(node.arguments[0])) {
                context.report({ node: node, message: 'Prefer using thru instead of function call in chain start.' });
            }
        };
        return visitors;
    }
};