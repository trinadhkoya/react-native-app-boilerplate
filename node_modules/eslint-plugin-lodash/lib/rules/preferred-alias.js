/**
 * @fileoverview Rule to ensure consistency of aliases of lodash methods
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var getDocsUrl = require('../util/getDocsUrl');

module.exports = {
    meta: {
        docs: {
            url: getDocsUrl('preferred-alias')
        },
        schema: [{
            type: 'object',
            properties: {
                ingoreMethods: {
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
            getLodashMethodVisitors = _require.getLodashMethodVisitors;

        var _require2 = require('../util/methodDataUtil'),
            isMainAlias = _require2.isMainAlias,
            getMainAlias = _require2.getMainAlias;

        var _context$options = _slicedToArray(context.options, 1),
            _context$options$ = _context$options[0];

        _context$options$ = _context$options$ === undefined ? {} : _context$options$;
        var _context$options$$ign = _context$options$.ignoreMethods,
            ignoreMethods = _context$options$$ign === undefined ? [] : _context$options$$ign;

        var includes = require('lodash/includes');

        return getLodashMethodVisitors(context, function (node, iteratee, _ref) {
            var method = _ref.method,
                version = _ref.version;

            if (!includes(ignoreMethods, method) && !isMainAlias(version, method)) {
                var mainAlias = getMainAlias(version, method);
                if (mainAlias) {
                    context.report({
                        node: node,
                        message: 'Method \'' + method + '\' is an alias, for consistency prefer using \'' + mainAlias + '\''
                    });
                }
            }
        });
    }
};