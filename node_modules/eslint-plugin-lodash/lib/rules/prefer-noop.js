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
            url: getDocsUrl('prefer-noop')
        }
    },

    create: function create(context) {
        var _require = require('../util/astUtil'),
            getFirstFunctionLine = _require.getFirstFunctionLine;

        function reportIfEmptyFunction(node) {
            if (!getFirstFunctionLine(node) && node.parent.type !== 'MethodDefinition' && !node.generator && !node.async) {
                context.report({ node: node, message: 'Prefer _.noop over an empty function' });
            }
        }

        return {
            FunctionExpression: reportIfEmptyFunction,
            ArrowFunctionExpression: reportIfEmptyFunction
        };
    }
};