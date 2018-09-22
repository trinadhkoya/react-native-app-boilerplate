/**
 * @fileoverview Rule to check if there's a method in the chain start that can be in the chain
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var getDocsUrl = require('../util/getDocsUrl');

module.exports = {
    meta: {
        docs: {
            url: getDocsUrl('prefer-lodash-method')
        },
        schema: [{
            type: 'object',
            properties: {
                ignoredMethods: {
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                },
                ignoredObjects: {
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                }
            }
        }]
    },

    create: function create(context) {
        var _require = require('../util/lodashUtil'),
            getLodashContext = _require.getLodashContext,
            isNativeCollectionMethodCall = _require.isNativeCollectionMethodCall,
            getLodashMethodCallExpVisitor = _require.getLodashMethodCallExpVisitor;

        var _require2 = require('../util/astUtil'),
            getMethodName = _require2.getMethodName,
            getCaller = _require2.getCaller;

        var _require3 = require('../util/methodDataUtil'),
            methodExists = _require3.methodExists;

        var keys = require('lodash/keys');
        var get = require('lodash/get');
        var includes = require('lodash/includes');
        var matches = require('lodash/matches');
        var some = require('lodash/some');
        var map = require('lodash/map');
        var assign = require('lodash/assign');
        var ignoredMethods = get(context, ['options', 0, 'ignoreMethods'], []);
        var ignoredObjects = get(context, ['options', 0, 'ignoreObjects'], []);
        var usingLodash = new Set();

        var nativeStringMap = {
            endsWith: 'endsWith',
            includes: 'includes',
            padEnd: 'padEnd',
            padStart: 'padStart',
            repeat: 'repeat',
            replace: 'replace',
            split: 'split',
            startsWith: 'startsWith',
            toLowerCase: 'toLower',
            toUpperCase: 'toUpper',
            trim: 'trim'
        };

        var lodashContext = getLodashContext(context);

        function isNonNullObjectCreate(callerName, methodName, arg) {
            return callerName === 'Object' && methodName === 'create' && get(arg, 'value') !== null;
        }

        function isStaticNativeMethodCall(node) {
            var staticMethods = {
                Object: ['assign', 'keys', 'values'],
                Array: ['isArray']
            };
            var callerName = get(node, 'callee.object.name');
            var methodName = getMethodName(node);
            return callerName in staticMethods && includes(staticMethods[callerName], methodName) || isNonNullObjectCreate(callerName, methodName, node.arguments[0]);
        }

        function isNativeStringMethodCall(node) {
            var lodashFunction = nativeStringMap[getMethodName(node)];
            return Boolean(lodashFunction) && methodExists(lodashContext.version, lodashFunction);
        }

        function canUseLodash(node) {
            return isNativeCollectionMethodCall(node) || isStaticNativeMethodCall(node) || isNativeStringMethodCall(node);
        }

        function getTextOfNode(node) {
            if (node) {
                if (node.type === 'Identifier') {
                    return node.name;
                }
                return context.getSourceCode().getText(node);
            }
        }

        function someMatch(patterns, str) {
            return str && some(patterns, function (pattern) {
                return str.match(pattern);
            });
        }

        function shouldIgnore(node) {
            return someMatch(ignoredMethods, getMethodName(node)) || someMatch(ignoredObjects, getTextOfNode(getCaller(node)));
        }
        return assign({
            CallExpression: getLodashMethodCallExpVisitor(lodashContext, function (node) {
                usingLodash.add(node);
            }),
            'CallExpression:exit': function CallExpressionExit(node) {
                if (!usingLodash.has(node) && !shouldIgnore(node) && canUseLodash(node)) {
                    var lodashMethodName = getMethodName(node);
                    if (isNativeStringMethodCall(node)) {
                        lodashMethodName = nativeStringMap[lodashMethodName];
                    }
                    context.report({ node: node, message: 'Prefer \'_.' + lodashMethodName + '\' over the native function.' });
                }
            }
        }, lodashContext.getImportVisitors());
    }
};