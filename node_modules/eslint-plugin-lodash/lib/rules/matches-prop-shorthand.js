/**
 * @fileoverview Rule to check if the macthesProperty shorthand can be used
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

var getDocsUrl = require('../util/getDocsUrl');

module.exports = {
    meta: {
        docs: {
            url: getDocsUrl('matches-prop-shorthand')
        },
        schema: [{
            enum: ['always', 'never']
        }, {
            type: 'object',
            properties: {
                onlyLiterals: {
                    type: 'boolean'
                }
            }
        }]
    },

    create: function create(context) {
        var _require = require('../util/lodashUtil'),
            isCallToLodashMethod = _require.isCallToLodashMethod,
            getShorthandVisitors = _require.getShorthandVisitors;

        var _require2 = require('../util/astUtil'),
            isEqEqEqToMemberOf = _require2.isEqEqEqToMemberOf,
            getValueReturnedInFirstStatement = _require2.getValueReturnedInFirstStatement,
            getFirstParamName = _require2.getFirstParamName;

        var _require$getSettings = require('../util/settingsUtil').getSettings(context),
            version = _require$getSettings.version;

        var onlyLiterals = context.options[1] && context.options[1].onlyLiterals;

        function isFunctionDeclarationThatCanUseShorthand(func) {
            return isEqEqEqToMemberOf(getValueReturnedInFirstStatement(func), getFirstParamName(func), { onlyLiterals: onlyLiterals });
        }

        function canUseShorthand(iteratee, lodashContext) {
            return isFunctionDeclarationThatCanUseShorthand(iteratee) || isCallToLodashMethod(iteratee, 'matchesProperty', lodashContext);
        }

        function callHasExtraParamAfterIteratee(node, iteratee) {
            return node.arguments[node.arguments.indexOf(iteratee) + 1];
        }

        var matchesPropertyChecks = {
            3: function _(node, iteratee) {
                return iteratee && iteratee.type === 'Literal' && callHasExtraParamAfterIteratee(node, iteratee);
            },
            4: function _(node, iteratee) {
                return iteratee && iteratee.type === 'ArrayExpression';
            }
        };

        return getShorthandVisitors(context, {
            canUseShorthand: canUseShorthand,
            usesShorthand: matchesPropertyChecks[version]
        }, {
            always: 'Prefer matches property syntax',
            never: 'Do not use matches property syntax'
        });
    }
};