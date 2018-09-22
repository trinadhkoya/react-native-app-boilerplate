/**
 * @fileoverview Rule to check if a findIndex comparison should be a call to _.some
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var getDocsUrl = require('../util/getDocsUrl');

module.exports = {
    meta: {
        docs: {
            url: getDocsUrl('prefer-some')
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
            isFindIndexCall = _require.isFindIndexCall;

        var _require2 = require('../util/lodashUtil'),
            getLodashMethodVisitors = _require2.getLodashMethodVisitors;

        var _require3 = require('../util/methodDataUtil'),
            isAliasOfMethod = _require3.isAliasOfMethod;

        var visitors = getLodashMethodVisitors(context, function (node, iteratee, _ref) {
            var method = _ref.method,
                version = _ref.version;

            if (isAliasOfMethod(version, 'findIndex', method) && node === getExpressionComparedToInt(node.parent, -1, true)) {
                context.report({ node: node, message: 'Prefer _.some over findIndex comparison to -1' });
            }
        });

        if (includeNative) {
            visitors.BinaryExpression = function (node) {
                if (isFindIndexCall(getExpressionComparedToInt(node, -1, true))) {
                    context.report({ node: node, message: 'Prefer _.some over findIndex comparison to -1' });
                }
            };
        }
        return visitors;
    }
};