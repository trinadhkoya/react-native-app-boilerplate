/**
 * @fileoverview Rule to check if an indexOfComparison should be a call to _.includes
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var getDocsUrl = require('../util/getDocsUrl');

module.exports = {
    meta: {
        docs: {
            url: getDocsUrl('prefer-includes')
        },
        schema: [{
            type: 'object',
            properties: {
                includeNative: {
                    type: 'boolean'
                }
            }
        }]
    },

    create: function create(context) {
        var includeNative = context.options[0] && context.options[0].includeNative;

        var _require = require('../util/astUtil'),
            getExpressionComparedToInt = _require.getExpressionComparedToInt,
            isIndexOfCall = _require.isIndexOfCall;

        var _require2 = require('../util/lodashUtil'),
            getLodashMethodVisitors = _require2.getLodashMethodVisitors;

        var _require3 = require('../util/methodDataUtil'),
            isAliasOfMethod = _require3.isAliasOfMethod;

        var visitors = getLodashMethodVisitors(context, function (node, iteratee, _ref) {
            var method = _ref.method,
                version = _ref.version;

            if (isAliasOfMethod(version, 'indexOf', method) && node === getExpressionComparedToInt(node.parent, -1, true)) {
                context.report({ node: node, message: 'Prefer _.includes over indexOf comparison to -1' });
            }
        });
        if (includeNative) {
            visitors.BinaryExpression = function (node) {
                if (isIndexOfCall(getExpressionComparedToInt(node, -1, true))) {
                    context.report({ node: node, message: 'Prefer _.includes over indexOf comparison to -1' });
                }
            };
        }
        return visitors;
    }
};