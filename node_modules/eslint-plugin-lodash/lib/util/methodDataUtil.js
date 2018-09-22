'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _ = require('lodash');

var getMethodData = _.memoize(function (version) {
    return require('./methodDataByVersion/' + version);
});

/**
 * Gets a major version number and method name and returns all its aliases including itself.
 * @param {Number} version
 * @param {string} method
 * @returns {string[]}
 */
var expandAlias = function expandAlias(version, method) {
    var methodAliases = _.get(getMethodData(version), [method, 'aliases'], []);
    return [method].concat(_toConsumableArray(methodAliases));
};

/**
 * Gets a major version number and a list of methods and returns a list of methods and all their aliases
 * @param version
 * @param methods
 * @returns {string[]}
 */
function expandAliases(version, methods) {
    return _.flatMap(methods, function (method) {
        return expandAlias(version, method);
    });
}

/**
 * Returns whether the method is the main alias
 * @param version
 * @param method
 * @returns {Boolean}
 */
function isMainAlias(version, method) {
    return Boolean(getMethodData(version)[method]);
}

/**
 * Gets a list of all chainable methods and their aliases for a given version
 * @param {Number} version
 * @param {string} method
 * @returns {boolean}
 */
function isChainable(version, method) {
    var data = getMethodData(version);
    return _.get(data, [getMainAlias(version, method), 'chainable'], false);
}

/**
 * Gets whether the method is a collection method
 * @param {Number} version
 * @param {string} method
 * @returns {Boolean}
 */
function isCollectionMethod(version, method) {
    return methodSupportsShorthand(version, method) || _.includes(expandAliases(version, ['reduce', 'reduceRight']), method);
}

/**
 * Returns whether the node's method call supports using shorthands in the specified version
 * @param {Number} version
 * @param {string} method
 * @returns {boolean}
 */
function methodSupportsShorthand(version, method) {
    var mainAlias = getMainAlias(version, method);
    return _.get(getMethodData(version), [mainAlias, 'shorthand']);
}

/**
 * Gets whether the method is a wrapper method
 * @param {Number} version
 * @param {string} method
 * @returns {boolean}
 */
function isWrapperMethod(version, method) {
    return _.get(getMethodData(version), [method, 'wrapper'], false);
}
/**
 * Gets whether the suspect is an alias of the method in a given version
 * @param {Number} version
 * @param {string} method
 * @param {string} suspect
 * @returns {boolean}
 */
function isAliasOfMethod(version, method, suspect) {
    return method === suspect || _.includes(_.get(getMethodData(version), [method, 'aliases']), suspect);
}

/**
 * Returns the main alias for the method in the specified version.
 * @param {number} version
 * @param {string} method
 * @returns {string}
 */
function getMainAlias(version, method) {
    var data = getMethodData(version);
    return data[method] ? method : _.findKey(data, function (methodData) {
        return _.includes(methodData.aliases, method);
    });
}

/**
 * Gets the index of the iteratee of a method when it isn't chained, or -1 if it doesn't have one.
 * @param {number} version
 * @param {string} method
 * @returns {number}
 */
function getIterateeIndex(version, method) {
    var mainAlias = getMainAlias(version, method);
    var methodData = getMethodData(version)[mainAlias];
    if (_.has(methodData, 'iterateeIndex')) {
        return methodData.iterateeIndex;
    }
    if (methodData && methodData.iteratee) {
        return 1;
    }
    return -1;
}

/**
 * Gets the maximum number of arguments to be given to the function in the specified version
 * @param {number} version
 * @param {string} name
 * @returns {number}
 */
function getFunctionMaxArity(version, name) {
    return _.get(getMethodData(version), [name, 'args'], Infinity);
}

var sideEffectIterationMethods = ['forEach', 'forEachRight', 'forIn', 'forInRight', 'forOwn', 'forOwnRight'];

/**
 * Gets a list of side effect iteration methods by version
 * @param {number} version
 * @returns {string[]}
 */
function getSideEffectIterationMethods(version) {
    return expandAliases(version, sideEffectIterationMethods);
}

/**
 * Returns whether the method exists in the specified version
 * @param {number} version
 * @param {string} method
 * @returns {boolean}
 */
function methodExists(version, method) {
    return Boolean(getMethodData(version)[method]);
}

module.exports = {
    isAliasOfMethod: isAliasOfMethod,
    isChainable: isChainable,
    methodSupportsShorthand: methodSupportsShorthand,
    isWrapperMethod: isWrapperMethod,
    isCollectionMethod: isCollectionMethod,
    isMainAlias: isMainAlias,
    getMainAlias: getMainAlias,
    getIterateeIndex: getIterateeIndex,
    getFunctionMaxArity: getFunctionMaxArity,
    getSideEffectIterationMethods: getSideEffectIterationMethods,
    methodExists: methodExists

    /**
     * A JSON object containing method info for a specific lodash major version
     @typedef {Object} VersionInfo
     @property {Aliases} aliases
     @property {[string]} wrapper
     @property {Object.<string, [string]>} wrapperAliases
     @property {[string]} property
     @property {[string]} chainable
     */

};