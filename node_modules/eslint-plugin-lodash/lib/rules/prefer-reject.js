/**
 * @fileoverview Rule to check if a call to filter should be a call to reject
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var getDocsUrl = require('../util/getDocsUrl');

module.exports = {
    meta: {
        docs: {
            url: getDocsUrl('prefer-reject')
        },
        schema: [{
            type: 'integer'
        }]
    },

    create: function create(context) {
        var _require = require('../util/lodashUtil'),
            isCallToLodashMethod = _require.isCallToLodashMethod,
            getLodashMethodVisitors = _require.getLodashMethodVisitors;

        var _require2 = require('../util/astUtil'),
            getValueReturnedInFirstStatement = _require2.getValueReturnedInFirstStatement,
            getFirstParamName = _require2.getFirstParamName,
            isNegationOfMemberOf = _require2.isNegationOfMemberOf,
            isNotEqEqToMemberOf = _require2.isNotEqEqToMemberOf;

        var _require3 = require('../util/methodDataUtil'),
            isAliasOfMethod = _require3.isAliasOfMethod;

        var DEFAULT_MAX_PROPERTY_PATH_LENGTH = 3;
        var maxLength = parseInt(context.options[0], 10) || DEFAULT_MAX_PROPERTY_PATH_LENGTH;

        function isNegativeExpressionFunction(func, lodashContext) {
            var returnValue = getValueReturnedInFirstStatement(func);
            var firstParamName = getFirstParamName(func);
            return isNegationOfMemberOf(returnValue, firstParamName, { maxLength: maxLength }) || isNotEqEqToMemberOf(returnValue, firstParamName, { maxLength: maxLength }) || isCallToLodashMethod(func, 'negate', lodashContext);
        }

        return getLodashMethodVisitors(context, function (node, iteratee, _ref) {
            var method = _ref.method,
                version = _ref.version,
                lodashContext = _ref.lodashContext;

            if (isAliasOfMethod(version, 'filter', method) && isNegativeExpressionFunction(iteratee, lodashContext)) {
                context.report({ node: node, message: 'Prefer _.reject over negative condition' });
            }
        });
    }
};