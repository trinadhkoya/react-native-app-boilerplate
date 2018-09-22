/**
 * @fileoverview Rule to check if the matches shorthand can be used
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

var getDocsUrl = require('../util/getDocsUrl');

module.exports = {
    meta: {
        docs: {
            url: getDocsUrl('matches-shorthand')
        },
        schema: [{
            enum: ['always', 'never']
        }, {
            type: 'integer',
            minimum: 1
        }, {
            type: 'boolean'
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
        var matches = require('lodash/matches');

        var _require = require('../util/lodashUtil'),
            isCallToLodashMethod = _require.isCallToLodashMethod,
            getShorthandVisitors = _require.getShorthandVisitors;

        var _require2 = require('../util/astUtil'),
            isEqEqEq = _require2.isEqEqEq,
            isMemberExpOf = _require2.isMemberExpOf,
            isEqEqEqToMemberOf = _require2.isEqEqEqToMemberOf,
            getValueReturnedInFirstStatement = _require2.getValueReturnedInFirstStatement,
            getFirstParamName = _require2.getFirstParamName;

        var _require3 = require('../util/settingsUtil'),
            isEcmaFeatureOn = _require3.isEcmaFeatureOn;

        var DEFAULT_MAX_PROPERTY_PATH_LENGTH = 3;
        var onlyLiterals = context.options[3] && context.options[3].onlyLiterals;

        var isConjunction = matches({ type: 'LogicalExpression', operator: '&&' });

        function canBeObjectLiteralWithShorthandProperty(node, paramName) {
            return isEcmaFeatureOn(context, 'objectLiteralShorthandProperties') && isEqEqEq(node) && (isMemberExpOf(node.left, paramName, { maxLength: 1 }) && node.left.property.type === 'Identifier' && node.right.type === 'Identifier' && node.left.property.name === node.right.name || isMemberExpOf(node.right, paramName, { maxLength: 1 }) && node.right.property.type === 'Identifier' && node.left.type === 'Identifier' && node.right.property.name === node.left.name);
        }

        function isConjunctionOfEqEqEqToMemberOf(exp, paramName, maxLength) {
            var allowComputed = context.options[2] && isEcmaFeatureOn(context, 'objectLiteralComputedProperties');
            if (isConjunction(exp) || canBeObjectLiteralWithShorthandProperty(exp, paramName)) {
                var checkStack = [exp];
                var curr = void 0;
                var allParamMemberEq = true;
                curr = checkStack.pop();
                while (curr) {
                    if (isConjunction(curr)) {
                        checkStack.push(curr.left, curr.right);
                    } else if (!isEqEqEqToMemberOf(curr, paramName, { maxLength: maxLength, allowComputed: allowComputed, onlyLiterals: onlyLiterals })) {
                        allParamMemberEq = false;
                    }
                    curr = checkStack.pop();
                }
                return allParamMemberEq;
            }
        }

        function isFunctionDeclarationThatCanUseShorthand(func) {
            var maxPropertyPathLength = context.options[1] || DEFAULT_MAX_PROPERTY_PATH_LENGTH;
            return isConjunctionOfEqEqEqToMemberOf(getValueReturnedInFirstStatement(func), getFirstParamName(func), maxPropertyPathLength);
        }

        function canUseShorthand(iteratee, lodashContext) {
            return isFunctionDeclarationThatCanUseShorthand(iteratee) || isCallToLodashMethod(iteratee, 'matches', lodashContext);
        }

        function usesShorthand(node, iteratee) {
            return iteratee && iteratee.type === 'ObjectExpression';
        }

        return getShorthandVisitors(context, {
            canUseShorthand: canUseShorthand,
            usesShorthand: usesShorthand
        }, {
            always: 'Prefer matches syntax',
            never: 'Do not use matches syntax'
        });
    }
};