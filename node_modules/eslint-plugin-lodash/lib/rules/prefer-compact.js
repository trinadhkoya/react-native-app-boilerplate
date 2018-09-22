/**
 * @fileoverview Rule to check if a call to filter should be a call to compact
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var getDocsUrl = require('../util/getDocsUrl');

module.exports = {
    meta: {
        docs: {
            url: getDocsUrl('prefer-compact')
        }
    },

    create: function create(context) {
        var _require = require('../util/lodashUtil'),
            getLodashMethodVisitors = _require.getLodashMethodVisitors;

        var _require2 = require('../util/astUtil'),
            isNegationExpression = _require2.isNegationExpression,
            isIdentifierWithName = _require2.isIdentifierWithName,
            getValueReturnedInFirstStatement = _require2.getValueReturnedInFirstStatement,
            getFirstParamName = _require2.getFirstParamName;

        var _require3 = require('../util/methodDataUtil'),
            isAliasOfMethod = _require3.isAliasOfMethod;

        function isDoubleNegationOfParam(exp, paramName) {
            return isNegationExpression(exp) && isNegationExpression(exp.argument) && isIdentifierWithName(exp.argument.argument, paramName);
        }

        function isCallToBooleanCastOfParam(exp, paramName) {
            return exp && exp.type === 'CallExpression' && exp.callee.name === 'Boolean' && isIdentifierWithName(exp.arguments[0], paramName);
        }

        function isBooleanCastingFunction(func) {
            var returnValue = getValueReturnedInFirstStatement(func);
            var paramName = getFirstParamName(func);
            return func && func.type === 'Identifier' && func.name === 'Boolean' || isIdentifierWithName(returnValue, paramName) || isDoubleNegationOfParam(returnValue, paramName) || isCallToBooleanCastOfParam(returnValue, paramName);
        }

        return getLodashMethodVisitors(context, function (node, iteratee, _ref) {
            var method = _ref.method,
                version = _ref.version;

            if (isAliasOfMethod(version, 'filter', method) && (isBooleanCastingFunction(iteratee) || !iteratee)) {
                context.report({ node: node, message: 'Prefer _.compact over filtering of Boolean casting' });
            }
        });
    }
};