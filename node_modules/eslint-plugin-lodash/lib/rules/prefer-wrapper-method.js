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
            url: getDocsUrl('prefer-wrapper-method')
        }
    },

    create: function create(context) {
        var _require = require('../util/lodashUtil'),
            isLodashWrapperMethod = _require.isLodashWrapperMethod,
            getLodashContext = _require.getLodashContext;

        var lodashContext = getLodashContext(context);
        var visitors = lodashContext.getImportVisitors();
        visitors.CallExpression = function (node) {
            if (lodashContext.isLodashChainStart(node) && isLodashWrapperMethod(node.arguments[0], lodashContext.version)) {
                context.report({ node: node, message: 'Prefer {{name}} with wrapper method over inside the chain start.', data: { name: node.arguments[0].callee.property.name } });
            }
        };
        return visitors;
    }
};