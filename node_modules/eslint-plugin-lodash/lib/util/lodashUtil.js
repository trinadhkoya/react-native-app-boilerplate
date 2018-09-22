'use strict';

var _ = require('lodash');
var methodDataUtil = require('./methodDataUtil');
var astUtil = require('./astUtil');
var settingsUtil = require('./settingsUtil');
var LodashContext = require('./LodashContext');

/**
 * Returns whether or not a node is a chainable method call in the specified version
 * @param {Object} node
 * @param {number} version
 * @returns {boolean}
 */
function isChainable(node, version) {
    return methodDataUtil.isChainable(version, astUtil.getMethodName(node));
}

/**
 * Returns whether the node is a chain breaker method in the specified version
 * @param {Object} node
 * @param {number} version
 * @returns {boolean}
 */
function isChainBreaker(node, version) {
    return methodDataUtil.isAliasOfMethod(version, 'value', astUtil.getMethodName(node));
}

/**
 * Returns whether the node is a call to the specified method or one of its aliases in the version
 * @param {Object} node
 * @param {number} version
 * @param {string} method
 * @returns {boolean}
 */
function isCallToMethod(node, version, method) {
    return methodDataUtil.isAliasOfMethod(version, method, astUtil.getMethodName(node));
}

/**
 * Returns whether or not the node is a call to a lodash wrapper method
 * @param {Object} node
 * @param {number} version
 * @returns {boolean}
 */
function isLodashWrapperMethod(node, version) {
    return methodDataUtil.isWrapperMethod(version, astUtil.getMethodName(node));
}

/**
 * Gets the 'isX' method for a specified type, e.g. isObject
 * @param {string} name
 * @returns {string|null}
 */
function getIsTypeMethod(name) {
    var types = ['number', 'boolean', 'function', 'Function', 'string', 'object', 'undefined', 'Date', 'Array', 'Error', 'Element'];
    return _.includes(types, name) ? 'is' + _.capitalize(name) : null;
}

/**
 * Returns whether or not the node is a call to a native collection method
 * @param {Object} node
 * @returns {boolean}
 */
function isNativeCollectionMethodCall(node) {
    return _.includes(['every', 'fill', 'filter', 'find', 'findIndex', 'forEach', 'includes', 'map', 'reduce', 'reduceRight', 'some'], astUtil.getMethodName(node));
}

/**
 * Gets the context's Lodash settings and a function and returns a visitor that calls the function for every Lodash or chain call
 * @param {LodashContext} lodashContext
 * @param {LodashReporter} reporter
 * @returns {NodeTypeVisitor}
 */
function getLodashMethodCallExpVisitor(lodashContext, reporter) {
    return function (node) {
        var version = lodashContext.version;
        var iterateeIndex = void 0;
        if (lodashContext.isLodashChainStart(node)) {
            var prevNode = node;
            node = node.parent.parent;
            while (astUtil.getCaller(node) === prevNode && astUtil.isMethodCall(node) && !isChainBreaker(node, version)) {
                var method = astUtil.getMethodName(node);
                iterateeIndex = methodDataUtil.getIterateeIndex(version, method);
                reporter(node, node.arguments[iterateeIndex - 1], { callType: 'chained', method: method, version: version, lodashContext: lodashContext });
                prevNode = node;
                node = node.parent.parent;
            }
        } else if (lodashContext.isLodashCall(node)) {
            var _method = astUtil.getMethodName(node);
            iterateeIndex = methodDataUtil.getIterateeIndex(version, _method);
            reporter(node, node.arguments[iterateeIndex], { callType: 'method', method: _method, version: version, lodashContext: lodashContext });
        } else if (version !== 3) {
            var _method2 = lodashContext.getImportedLodashMethod(node);
            if (_method2) {
                iterateeIndex = methodDataUtil.getIterateeIndex(version, _method2);
                reporter(node, node.arguments[iterateeIndex], { method: _method2, callType: 'single', version: version, lodashContext: lodashContext });
            }
        }
    };
}

function isLodashCallToMethod(node, method, lodashContext) {
    return lodashContext.isLodashCall(node) && isCallToMethod(node, lodashContext.version, method);
}

function isCallToLodashMethod(node, method, lodashContext) {
    if (!node || node.type !== 'CallExpression') {
        return false;
    }
    return isLodashCallToMethod(node, method, lodashContext) || methodDataUtil.isAliasOfMethod(lodashContext.version, method, lodashContext.getImportedLodashMethod(node));
}

function getLodashMethodVisitors(context, lodashCallExpVisitor) {
    var lodashContext = new LodashContext(context);
    var visitors = lodashContext.getImportVisitors();
    visitors.CallExpression = getLodashMethodCallExpVisitor(lodashContext, lodashCallExpVisitor);
    return visitors;
}

function getShorthandVisitors(context, checks, messages) {
    var lodashContext = new LodashContext(context);
    var visitors = lodashContext.getImportVisitors();
    visitors.CallExpression = getLodashMethodCallExpVisitor(lodashContext, {
        always: function always(node, iteratee, _ref) {
            var method = _ref.method,
                version = _ref.version;

            if (methodDataUtil.methodSupportsShorthand(version, method) && checks.canUseShorthand(iteratee, lodashContext)) {
                context.report(iteratee, messages.always);
            }
        },
        never: function never(node, iteratee, _ref2) {
            var method = _ref2.method;

            if (checks.usesShorthand(node, iteratee, method)) {
                context.report(iteratee || node.callee.property, messages.never);
            }
        }
    }[context.options[0] || 'always']);
    return visitors;
}

/**
 *
 * @param context
 * @returns {LodashContext} a LodashContext for a given context
 */
function getLodashContext(context) {
    return new LodashContext(context);
}

module.exports = {
    isChainable: isChainable,
    isChainBreaker: isChainBreaker,
    isCallToMethod: isCallToMethod,
    isLodashWrapperMethod: isLodashWrapperMethod,
    getIsTypeMethod: getIsTypeMethod,
    isNativeCollectionMethodCall: isNativeCollectionMethodCall,
    getLodashMethodCallExpVisitor: getLodashMethodCallExpVisitor,
    isCallToLodashMethod: isCallToLodashMethod,
    getShorthandVisitors: getShorthandVisitors,
    getLodashMethodVisitors: getLodashMethodVisitors,
    getLodashContext: getLodashContext

    /**
     @callback LodashReporter
     @param {Object} node
     @param {Object} iteratee
     @param {Object?} options
     */

    /**
     @callback NodeTypeVisitor
     @param {Object} node
     */

    /**
     * @typedef {Object} ShorthandChecks
     * @property {function} canUseShorthand
     * @property {function} usesShorthand
     */

    /**
     * @typedef {object} ShorthandMessages
     * @property {string} always
     * @property {string} never
     */

};