/**
 * @fileoverview Rule to check that all uses of `this` inside collection methods are bound
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var getDocsUrl = require('../util/getDocsUrl');

module.exports = {
    meta: {
        docs: {
            url: getDocsUrl('no-unbound-this')
        }
    },

    create: function create(context) {
        var _require = require('../util/lodashUtil'),
            getLodashMethodCallExpVisitor = _require.getLodashMethodCallExpVisitor,
            getLodashContext = _require.getLodashContext;

        var _require2 = require('../util/methodDataUtil'),
            isCollectionMethod = _require2.isCollectionMethod;

        var _require3 = require('../util/astUtil'),
            isFunctionExpression = _require3.isFunctionExpression;

        var assign = require('lodash/assign');
        var funcInfos = new Map();
        var currFuncInfo = {
            thisUses: []
        };
        var lodashContext = getLodashContext(context);
        return assign({
            'CallExpression:exit': getLodashMethodCallExpVisitor(lodashContext, function (node, iteratee, _ref) {
                var method = _ref.method,
                    version = _ref.version;

                if ((isCollectionMethod(version, method) || /^forEach(Right)?$/.test(method)) && funcInfos.has(iteratee)) {
                    var _funcInfos$get = funcInfos.get(iteratee),
                        thisUses = _funcInfos$get.thisUses;

                    if (isFunctionExpression(iteratee) && thisUses.length) {
                        thisUses.forEach(function (thisNode) {
                            context.report({ node: thisNode, message: 'Do not use `this` without binding in collection methods' });
                        });
                    }
                }
            }),
            ThisExpression: function ThisExpression(node) {
                currFuncInfo.thisUses.push(node);
            },
            onCodePathStart: function onCodePathStart(codePath, node) {
                currFuncInfo = {
                    upper: currFuncInfo,
                    codePath: codePath,
                    thisUses: []
                };
                funcInfos.set(node, currFuncInfo);
            },
            onCodePathEnd: function onCodePathEnd() {
                currFuncInfo = currFuncInfo.upper;
            }
        }, lodashContext.getImportVisitors());
    }
};