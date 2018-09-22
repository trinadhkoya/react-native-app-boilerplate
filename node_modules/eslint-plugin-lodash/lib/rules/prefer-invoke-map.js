/**
 * @fileoverview Rule to check if a call to map should be a call to invokeMap
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var getDocsUrl = require('../util/getDocsUrl');

module.exports = {
    meta: {
        docs: {
            url: getDocsUrl('prefer-invoke-map')
        }
    },

    create: function create(context) {
        var _require = require('../util/lodashUtil'),
            getLodashMethodVisitors = _require.getLodashMethodVisitors;

        var _require2 = require('../util/astUtil'),
            isCallFromObject = _require2.isCallFromObject,
            getValueReturnedInFirstStatement = _require2.getValueReturnedInFirstStatement,
            getFirstParamName = _require2.getFirstParamName;

        var _require3 = require('../util/methodDataUtil'),
            isAliasOfMethod = _require3.isAliasOfMethod;

        function isOnlyUsedForObject(func, firstParamName) {
            var declaredVariables = context.getDeclaredVariables(func);
            return declaredVariables.every(function (variable) {
                return variable.references.length === 0 || variable.name === firstParamName && variable.references.length === 1;
            });
        }

        function isFunctionMethodCallOfParam(func) {
            var firstParamName = getFirstParamName(func);
            return firstParamName && isCallFromObject(getValueReturnedInFirstStatement(func), firstParamName) && isOnlyUsedForObject(func, firstParamName);
        }

        return getLodashMethodVisitors(context, function (node, iteratee, _ref) {
            var method = _ref.method,
                version = _ref.version;

            if (isAliasOfMethod(version, 'map', method) && isFunctionMethodCallOfParam(iteratee)) {
                context.report({ node: node, message: 'Prefer _.invokeMap over map to a method call.' });
            }
        });
    }
};