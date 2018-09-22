/**
 * @fileoverview Rule to check if the identity shorthand can be used
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

var getDocsUrl = require('../util/getDocsUrl');

module.exports = {
    meta: {
        docs: {
            url: getDocsUrl('identity-shorthand')
        },
        schema: [{
            enum: ['always', 'never']
        }]
    },

    create: function create(context) {
        var get = require('lodash/get');
        var matches = require('lodash/matches');
        var overSome = require('lodash/overSome');

        var _require = require('../util/methodDataUtil'),
            methodSupportsShorthand = _require.methodSupportsShorthand;

        var _require2 = require('../util/lodashUtil'),
            getShorthandVisitors = _require2.getShorthandVisitors;

        var _require3 = require('../util/astUtil'),
            getFirstParamName = _require3.getFirstParamName,
            getValueReturnedInFirstStatement = _require3.getValueReturnedInFirstStatement;

        var settings = require('../util/settingsUtil').getSettings(context);

        function isExplicitIdentityFunction(iteratee) {
            var firstParamName = getFirstParamName(iteratee);
            return firstParamName && get(getValueReturnedInFirstStatement(iteratee), 'name') === firstParamName;
        }

        var isLodashIdentityFunction = matches({
            type: 'MemberExpression',
            object: { name: settings.pragma },
            property: { name: 'identity' }
        });

        var canUseShorthand = overSome(isExplicitIdentityFunction, isLodashIdentityFunction);

        function usesShorthand(node, iteratee, method) {
            return methodSupportsShorthand(settings.version, method) && !iteratee;
        }

        return getShorthandVisitors(context, {
            canUseShorthand: canUseShorthand,
            usesShorthand: usesShorthand
        }, {
            always: 'Prefer omitting the iteratee over a function that returns its argument',
            never: 'Do not use the identity shorthand syntax'
        });
    }
};