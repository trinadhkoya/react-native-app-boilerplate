/**
 * @fileoverview Rule to check if a call to map and flatten should be a call to _.flatMap
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var getDocsUrl = require('../util/getDocsUrl');

module.exports = {
    meta: {
        docs: {
            url: getDocsUrl('prefer-flat-map')
        }
    },

    create: function create(context) {
        var _require = require('../util/lodashUtil'),
            getLodashMethodVisitors = _require.getLodashMethodVisitors,
            isCallToMethod = _require.isCallToMethod,
            isCallToLodashMethod = _require.isCallToLodashMethod;

        var _require2 = require('../util/astUtil'),
            getCaller = _require2.getCaller;

        var _require3 = require('../util/methodDataUtil'),
            isAliasOfMethod = _require3.isAliasOfMethod;

        function isChainedMapFlatten(callType, node, version) {
            return callType === 'chained' && isCallToMethod(getCaller(node), version, 'map');
        }

        return getLodashMethodVisitors(context, function (node, iteratee, _ref) {
            var method = _ref.method,
                version = _ref.version,
                callType = _ref.callType,
                lodashContext = _ref.lodashContext;

            if (isAliasOfMethod(version, 'flatten', method) && (isChainedMapFlatten(callType, node, version) || isCallToLodashMethod(node.arguments[0], 'map', lodashContext))) {
                context.report({ node: node, message: 'Prefer _.flatMap over consecutive map and flatten.' });
            }
        });
    }
};