/**
 * @fileoverview Rule to check if a call to _.indexOf === 0 should be a call to _.startsWith
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var getDocsUrl = require('../util/getDocsUrl');

module.exports = {
    meta: {
        docs: {
            url: getDocsUrl('prefer-startswith')
        }
    },

    create: function create(context) {
        var _require = require('../util/astUtil'),
            isIndexOfCall = _require.isIndexOfCall,
            getExpressionComparedToInt = _require.getExpressionComparedToInt;

        return {
            BinaryExpression: function BinaryExpression(node) {
                if (isIndexOfCall(getExpressionComparedToInt(node, 0))) {
                    context.report({ node: node, message: 'Prefer _.startsWith instead of comparing indexOf() to 0' });
                }
            }
        };
    }
};