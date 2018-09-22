/**
 * @fileoverview Rule to check if a call to map should be a call to times
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var getDocsUrl = require('../util/getDocsUrl');

module.exports = {
    meta: {
        docs: {
            url: getDocsUrl('prefer-times')
        }
    },

    create: function create(context) {
        var _require = require('../util/lodashUtil'),
            getLodashMethodVisitors = _require.getLodashMethodVisitors;

        var _require2 = require('../util/methodDataUtil'),
            isAliasOfMethod = _require2.isAliasOfMethod;

        var get = require('lodash/get');
        return getLodashMethodVisitors(context, function (node, iteratee, _ref) {
            var method = _ref.method,
                version = _ref.version;

            if (isAliasOfMethod(version, 'map', method) && get(iteratee, 'params.length') === 0) {
                context.report({ node: node, message: 'Prefer _.times over _.map without using arguments' });
            }
        });
    }
};