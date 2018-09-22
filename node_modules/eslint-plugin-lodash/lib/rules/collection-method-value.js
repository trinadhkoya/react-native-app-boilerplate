/**
 * @fileoverview Rule to enforce usage of collection method values
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var getDocsUrl = require('../util/getDocsUrl');

module.exports = {
    meta: {
        docs: {
            url: getDocsUrl('collection-method-value')
        }
    },

    create: function create(context) {
        var _require = require('../util/lodashUtil'),
            isChainBreaker = _require.isChainBreaker,
            getLodashMethodVisitors = _require.getLodashMethodVisitors,
            isCallToMethod = _require.isCallToMethod;

        var _require2 = require('../util/astUtil'),
            getMethodName = _require2.getMethodName;

        var _require3 = require('../util/methodDataUtil'),
            isCollectionMethod = _require3.isCollectionMethod,
            isAliasOfMethod = _require3.isAliasOfMethod,
            getSideEffectIterationMethods = _require3.getSideEffectIterationMethods;

        var includes = require('lodash/includes');

        function parentUsesValue(node, callType, version) {
            var isBeforeChainBreaker = callType === 'chained' && isChainBreaker(node.parent.parent, version);
            return (isBeforeChainBreaker ? node.parent.parent : node).parent.type !== 'ExpressionStatement';
        }

        function isPureLodashCollectionMethod(method, version) {
            return isCollectionMethod(version, method) && !isAliasOfMethod(version, 'remove', method);
        }

        function isSideEffectIterationMethod(method, version) {
            return includes(getSideEffectIterationMethods(version), method);
        }

        function isParentCommit(node, callType, version) {
            return callType === 'chained' && isCallToMethod(node.parent.parent, version, 'commit');
        }

        return getLodashMethodVisitors(context, function (node, iteratee, _ref) {
            var method = _ref.method,
                version = _ref.version,
                callType = _ref.callType;

            if (isPureLodashCollectionMethod(method, version) && !parentUsesValue(node, callType, version)) {
                context.report({ node: node, message: 'Use value returned from _.' + method });
            } else if (isSideEffectIterationMethod(method, version) && parentUsesValue(node, callType, version) && !isParentCommit(node, callType, version)) {
                context.report({ node: node, message: 'Do not use value returned from _.' + getMethodName(node) });
            }
        });
    }
};