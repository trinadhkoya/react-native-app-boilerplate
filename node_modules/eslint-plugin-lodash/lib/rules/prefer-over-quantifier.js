/**
 * @fileoverview Rule to check if a _.filter condition or multiple filters should be _.overEvery or _.overSome
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var getDocsUrl = require('../util/getDocsUrl');

module.exports = {
    meta: {
        docs: {
            url: getDocsUrl('prefer-over-quantifier')
        }
    },

    create: function create(context) {
        var _require = require('../util/lodashUtil'),
            getLodashMethodVisitors = _require.getLodashMethodVisitors;

        var _require2 = require('../util/astUtil'),
            getValueReturnedInFirstStatement = _require2.getValueReturnedInFirstStatement,
            getFirstParamName = _require2.getFirstParamName,
            isObjectOfMethodCall = _require2.isObjectOfMethodCall,
            getMethodName = _require2.getMethodName;

        var _require3 = require('../util/methodDataUtil'),
            isAliasOfMethod = _require3.isAliasOfMethod;

        var conditionMethods = ['filter', 'reject', 'pickBy', 'omitBy', 'findIndex', 'findLastIndex', 'find', 'findLast', 'findKey', 'findLastKey'];
        var message = 'Prefer _.{{method}} instead of a {{connective}}';

        var reportConstants = {
            '&&': {
                method: 'overEvery',
                connective: 'conjunction'
            },
            '||': {
                method: 'overSome',
                connective: 'disjunction'
            }
        };

        function usesShorthandInChain(node) {
            return node.arguments.length === 0 || node.arguments.length === 1 && node.arguments[0].type === 'Identifier';
        }

        function isOnlyParamInvocationsWithOperator(node, paramName, operator) {
            if (node.type === 'CallExpression') {
                return usesShorthandInChain(node) && node.arguments[0] && node.arguments[0].name === paramName;
            }
            if (node.type === 'LogicalExpression') {
                return node.operator === operator && isOnlyParamInvocationsWithOperator(node.left, paramName, operator) && isOnlyParamInvocationsWithOperator(node.right, paramName, operator);
            }
        }

        function isCallToConditionMethod(method, version) {
            return conditionMethods.some(function (m) {
                return isAliasOfMethod(version, m, method);
            });
        }

        function reportIfConnectiveOfParamInvocations(node) {
            var retVal = getValueReturnedInFirstStatement(node);
            var paramName = getFirstParamName(node);
            if (retVal && retVal.type === 'LogicalExpression' && (retVal.operator === '&&' || retVal.operator === '||')) {
                if (isOnlyParamInvocationsWithOperator(retVal, paramName, retVal.operator)) {
                    context.report({ node: node, message: message, data: reportConstants[retVal.operator] });
                }
            }
        }

        function reportIfDoubleFilterLiteral(callType, node, version) {
            if (callType === 'chained' && usesShorthandInChain(node) && isObjectOfMethodCall(node) && isCallToConditionMethod(getMethodName(node.parent.parent), version) && usesShorthandInChain(node.parent.parent)) {
                context.report({ node: node, message: message, data: reportConstants['&&'] });
            }
        }

        return getLodashMethodVisitors(context, function (node, iteratee, _ref) {
            var method = _ref.method,
                version = _ref.version,
                callType = _ref.callType;

            if (isCallToConditionMethod(method, version)) {
                reportIfConnectiveOfParamInvocations(iteratee);
                reportIfDoubleFilterLiteral(callType, node, version);
            }
        });
    }
};