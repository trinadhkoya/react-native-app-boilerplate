/**
 * @fileoverview Rule to make sure lodash method calls don't use superfluous arguments
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var getDocsUrl = require('../util/getDocsUrl');

module.exports = {
    meta: {
        docs: {
            url: getDocsUrl('no-extra-args')
        }
    },

    create: function create(context) {
        var _require$getSettings = require('../util/settingsUtil').getSettings(context),
            version = _require$getSettings.version;

        var _require = require('../util/lodashUtil'),
            getLodashMethodVisitors = _require.getLodashMethodVisitors;

        var _require2 = require('../util/methodDataUtil'),
            getFunctionMaxArity = _require2.getFunctionMaxArity;

        function getExpectedArity(callType, method) {
            var maxArity = getFunctionMaxArity(version, method);
            return Math.max(callType === 'chained' ? maxArity - 1 : maxArity, 0);
        }

        return getLodashMethodVisitors(context, function (node, iteratee, _ref) {
            var callType = _ref.callType,
                method = _ref.method;

            var expectedArity = getExpectedArity(callType, method);
            if (node.arguments.length > expectedArity) {
                context.report({
                    node: node,
                    message: 'Too many arguments passed to `{{method}}` (expected {{expectedArity}}).',
                    data: { method: method, expectedArity: expectedArity }
                });
            }
        });
    }
};