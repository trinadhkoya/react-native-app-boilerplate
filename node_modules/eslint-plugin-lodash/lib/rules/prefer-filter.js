/**
 * @fileoverview Rule to check if a call to _.forEach should be a call to _.filter
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var getDocsUrl = require('../util/getDocsUrl');

module.exports = {
    meta: {
        docs: {
            url: getDocsUrl('prefer-filter')
        },
        schema: [{
            type: 'integer'
        }]
    },

    create: function create(context) {
        var _require = require('../util/lodashUtil'),
            getLodashMethodVisitors = _require.getLodashMethodVisitors;

        var _require2 = require('../util/astUtil'),
            isIdentifierWithName = _require2.isIdentifierWithName,
            isMemberExpOf = _require2.isMemberExpOf,
            isNegationOfMemberOf = _require2.isNegationOfMemberOf,
            isEqEqEqToMemberOf = _require2.isEqEqEqToMemberOf,
            isNotEqEqToMemberOf = _require2.isNotEqEqToMemberOf,
            getFirstFunctionLine = _require2.getFirstFunctionLine,
            hasOnlyOneStatement = _require2.hasOnlyOneStatement,
            getFirstParamName = _require2.getFirstParamName;

        var _require3 = require('../util/methodDataUtil'),
            isAliasOfMethod = _require3.isAliasOfMethod;

        var DEFAULT_MAX_PROPERTY_PATH_LENGTH = 3;
        var maxLength = parseInt(context.options[0], 10) || DEFAULT_MAX_PROPERTY_PATH_LENGTH;

        function isIfWithoutElse(statement) {
            return statement && statement.type === 'IfStatement' && !statement.alternate;
        }

        function canBeShorthand(exp, paramName) {
            return isIdentifierWithName(exp, paramName) || isMemberExpOf(exp, paramName, { maxLength: maxLength }) || isNegationOfMemberOf(exp, paramName, { maxLength: maxLength }) || isEqEqEqToMemberOf(exp, paramName, { maxLength: maxLength }) || isNotEqEqToMemberOf(exp, paramName, { maxLength: maxLength });
        }

        function onlyHasSimplifiableIf(func) {
            var firstLine = getFirstFunctionLine(func);
            return func && hasOnlyOneStatement(func) && func.params.length === 1 && isIfWithoutElse(firstLine) && canBeShorthand(firstLine.test, getFirstParamName(func));
        }

        return getLodashMethodVisitors(context, function (node, iteratee, _ref) {
            var method = _ref.method,
                version = _ref.version;

            if (isAliasOfMethod(version, 'forEach', method) && onlyHasSimplifiableIf(iteratee)) {
                context.report({ node: node, message: 'Prefer _.filter or _.some over an if statement inside a _.forEach' });
            }
        });
    }
};