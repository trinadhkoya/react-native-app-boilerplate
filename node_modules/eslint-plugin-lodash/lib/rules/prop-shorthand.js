/**
 * @fileoverview Rule to check if the property shorthand can be used
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

var getDocsUrl = require('../util/getDocsUrl');

module.exports = {
    meta: {
        docs: {
            url: getDocsUrl('prop-shorthand')
        },
        schema: [{
            enum: ['always', 'never']
        }]
    },

    create: function create(context) {
        var _require = require('../util/lodashUtil'),
            isCallToLodashMethod = _require.isCallToLodashMethod,
            getShorthandVisitors = _require.getShorthandVisitors;

        var _require2 = require('../util/astUtil'),
            isMemberExpOf = _require2.isMemberExpOf,
            getValueReturnedInFirstStatement = _require2.getValueReturnedInFirstStatement,
            getFirstParamName = _require2.getFirstParamName;

        function isExplicitParamFunction(func) {
            return isMemberExpOf(getValueReturnedInFirstStatement(func), getFirstParamName(func), { allowComputed: false });
        }

        function canUseShorthand(iteratee, lodashContext) {
            return isCallToLodashMethod(iteratee, 'property', lodashContext) || isExplicitParamFunction(iteratee);
        }

        function usesShorthand(node, iteratee) {
            return iteratee && iteratee.type === 'Literal' && !node.arguments[node.arguments.indexOf(iteratee) + 1];
        }

        return getShorthandVisitors(context, {
            canUseShorthand: canUseShorthand,
            usesShorthand: usesShorthand
        }, {
            always: 'Prefer property shorthand syntax',
            never: 'Do not use property shorthand syntax'
        });
    }
};