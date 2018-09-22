/**
 * @fileoverview Rule to enforce a consistent composition method
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var getDocsUrl = require('../util/getDocsUrl');

var possibleDirections = ['pipe', 'compose', 'flow', 'flowRight'];

module.exports = {
    meta: {
        docs: {
            url: getDocsUrl('consistent-compose')
        },
        schema: [{
            enum: possibleDirections
        }]
    },

    create: function create(context) {
        var includes = require('lodash/includes');

        var _require = require('../util/lodashUtil'),
            getLodashMethodVisitors = _require.getLodashMethodVisitors;

        var _require$getSettings = require('../util/settingsUtil').getSettings(context),
            version = _require$getSettings.version;

        var _require2 = require('../util/methodDataUtil'),
            getMainAlias = _require2.getMainAlias;

        var direction = context.options[0] || 'flow';
        var mainDirectionMethod = getMainAlias(version, direction);

        function isOtherDirection(method) {
            if (includes(possibleDirections, method)) {
                var methodDirection = getMainAlias(version, method);
                return methodDirection !== mainDirectionMethod;
            }
        }

        return getLodashMethodVisitors(context, function (node, iteratee, _ref) {
            var method = _ref.method;

            if (isOtherDirection(method)) {
                context.report({ node: node, message: 'Use _.' + direction + ' for composition' });
            }
        });
    }
};