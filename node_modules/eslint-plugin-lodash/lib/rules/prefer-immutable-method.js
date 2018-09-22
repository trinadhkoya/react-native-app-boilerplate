/**
 * @fileoverview Rule to prefer immutable methods over methods that mutate their arguments
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var getDocsUrl = require('../util/getDocsUrl');

var mutatingMethods = {
    pull: 'without',
    pullAll: 'difference',
    pullAllBy: 'differenceBy',
    pullAllWith: 'differenceWith',
    pullAt: 'filter',
    remove: 'filter'
};

var forEach = require('lodash/forEach');

module.exports = {
    meta: {
        docs: {
            url: getDocsUrl('prefer-immutable-method')
        }
    },

    create: function create(context) {
        var _require = require('../util/lodashUtil'),
            getLodashMethodVisitors = _require.getLodashMethodVisitors;

        var _require2 = require('../util/methodDataUtil'),
            isAliasOfMethod = _require2.isAliasOfMethod;

        var visitors = getLodashMethodVisitors(context, function (node, iteratee, _ref) {
            var method = _ref.method,
                version = _ref.version;

            forEach(mutatingMethods, function (preferred, mutatingMethod) {
                if (isAliasOfMethod(version, mutatingMethod, method)) {
                    context.report({
                        node: node,
                        message: 'Prefer _.' + preferred + ' instead of _.' + mutatingMethod
                    });
                }
            });
        });
        return visitors;
    }
};