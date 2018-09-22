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
            url: getDocsUrl('prefer-map')
        }
    },

    create: function create(context) {
        var _require = require('../util/lodashUtil'),
            getLodashMethodVisitors = _require.getLodashMethodVisitors;

        var _require2 = require('../util/astUtil'),
            getFirstFunctionLine = _require2.getFirstFunctionLine,
            hasOnlyOneStatement = _require2.hasOnlyOneStatement,
            getMethodName = _require2.getMethodName,
            isFunctionDefinitionWithBlock = _require2.isFunctionDefinitionWithBlock,
            collectParameterValues = _require2.collectParameterValues;

        var _require3 = require('../util/methodDataUtil'),
            isAliasOfMethod = _require3.isAliasOfMethod;

        var get = require('lodash/get');
        var includes = require('lodash/includes');

        function onlyHasPush(func) {
            var firstLine = getFirstFunctionLine(func);
            var firstParam = get(func, 'params[0]');
            var exp = func && !isFunctionDefinitionWithBlock(func) ? firstLine : firstLine && firstLine.expression;
            return func && hasOnlyOneStatement(func) && getMethodName(exp) === 'push' && !includes(collectParameterValues(firstParam), get(exp, 'callee.object.name'));
        }

        return getLodashMethodVisitors(context, function (node, iteratee, _ref) {
            var method = _ref.method,
                version = _ref.version;

            if (isAliasOfMethod(version, 'forEach', method) && onlyHasPush(iteratee)) {
                context.report({ node: node, message: 'Prefer _.map over a _.forEach with a push to an array inside' });
            }
        });
    }
};