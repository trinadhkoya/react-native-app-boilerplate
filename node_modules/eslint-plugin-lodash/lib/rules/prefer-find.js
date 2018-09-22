/**
 * @fileoverview Rule to check if a call to `_.filter` should be a call to `_.find`.
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var getDocsUrl = require('../util/getDocsUrl');

module.exports = {
    meta: {
        docs: {
            url: getDocsUrl('prefer-find')
        }
    },

    create: function create(context) {
        var _require = require('../util/lodashUtil'),
            getLodashMethodVisitors = _require.getLodashMethodVisitors,
            isCallToMethod = _require.isCallToMethod,
            isCallToLodashMethod = _require.isCallToLodashMethod;

        var _require2 = require('../util/methodDataUtil'),
            isAliasOfMethod = _require2.isAliasOfMethod;

        function isZeroIndexAccess(node) {
            return node.type === 'MemberExpression' && node.property.value === 0;
        }

        function isChainedBeforeMethod(callType, node, version, method) {
            return callType === 'chained' && isCallToMethod(node.parent.parent, version, method);
        }

        return getLodashMethodVisitors(context, function (node, iteratee, _ref) {
            var method = _ref.method,
                version = _ref.version,
                callType = _ref.callType,
                lodashContext = _ref.lodashContext;

            if (isAliasOfMethod(version, 'filter', method) || isAliasOfMethod(version, 'reject', method)) {
                if (isZeroIndexAccess(node.parent) || isCallToLodashMethod(node.parent, 'head', lodashContext) || isChainedBeforeMethod(callType, node, version, 'head')) {
                    context.report({ node: node, message: 'Prefer using `_.find` over selecting the first item of a filtered result' });
                }
                if (isCallToLodashMethod(node.parent, 'last', lodashContext) || isChainedBeforeMethod(callType, node, version, 'last')) {
                    context.report({ node: node, message: 'Prefer using `_.findLast` over selecting the last item of a filtered result' });
                }
            }
        });
    }
};