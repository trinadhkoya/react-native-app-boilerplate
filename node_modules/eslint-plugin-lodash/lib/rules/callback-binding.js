/**
 * @fileoverview Rule to disallow the use of a chain for a single method
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

var getDocsUrl = require('../util/getDocsUrl');

module.exports = {
    meta: {
        docs: {
            url: getDocsUrl('callback-binding')
        }
    },

    create: function create(context) {
        var _require = require('../util/lodashUtil'),
            getLodashMethodVisitors = _require.getLodashMethodVisitors;

        var _require2 = require('../util/methodDataUtil'),
            getFunctionMaxArity = _require2.getFunctionMaxArity;

        var _require3 = require('../util/astUtil'),
            getMethodName = _require3.getMethodName;

        var _require$getSettings = require('../util/settingsUtil').getSettings(context),
            version = _require$getSettings.version;

        var includes = require('lodash/includes');

        function isBound(node) {
            return node && node.type === 'CallExpression' && getMethodName(node) === 'bind' && node.arguments.length === 1;
        }

        var callExpressionReporters = {
            3: function _(node, iteratee) {
                if (isBound(iteratee)) {
                    context.report({ node: iteratee.callee.property, message: 'Unnecessary bind, pass `thisArg` to lodash method instead' });
                }
            },
            4: function _(node, iteratee, _ref) {
                var method = _ref.method,
                    callType = _ref.callType;

                var argsLength = node.arguments.length + (callType === 'chained' ? 1 : 0);
                if (iteratee && argsLength > getFunctionMaxArity(4, method)) {
                    context.report({ node: iteratee, message: 'Do not use Lodash 3 thisArg, use binding instead' });
                }
            }
        };

        return getLodashMethodVisitors(context, callExpressionReporters[version]);
    }
};