/**
 * @fileoverview Rule to check that iteratees for all collection functions except forEach return a value;
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var getDocsUrl = require('../util/getDocsUrl');

module.exports = {
    meta: {
        docs: {
            url: getDocsUrl('collection-return')
        }
    },

    create: function create(context) {
        var _require = require('../util/lodashUtil'),
            getLodashMethodCallExpVisitor = _require.getLodashMethodCallExpVisitor,
            getLodashContext = _require.getLodashContext;

        var _require2 = require('../util/methodDataUtil'),
            isCollectionMethod = _require2.isCollectionMethod;

        var _require3 = require('../util/astUtil'),
            isFunctionDefinitionWithBlock = _require3.isFunctionDefinitionWithBlock;

        var assign = require('lodash/assign');
        var funcInfos = new Map();
        var currFuncInfo = {};
        var lodashContext = getLodashContext(context);
        return assign({
            'CallExpression:exit': getLodashMethodCallExpVisitor(lodashContext, function (node, iteratee, _ref) {
                var method = _ref.method,
                    version = _ref.version;

                if (isCollectionMethod(version, method) && funcInfos.has(iteratee)) {
                    var _funcInfos$get = funcInfos.get(iteratee),
                        hasReturn = _funcInfos$get.hasReturn;

                    if (isFunctionDefinitionWithBlock(iteratee) && !hasReturn && !iteratee.async && !iteratee.generator) {
                        context.report({ node: node, message: 'Do not use _.' + method + ' without returning a value' });
                    }
                }
            }),
            ReturnStatement: function ReturnStatement() {
                currFuncInfo.hasReturn = true;
            },
            onCodePathStart: function onCodePathStart(codePath, node) {
                currFuncInfo = {
                    upper: currFuncInfo,
                    codePath: codePath,
                    hasReturn: false
                };
                funcInfos.set(node, currFuncInfo);
            },
            onCodePathEnd: function onCodePathEnd() {
                currFuncInfo = currFuncInfo.upper;
            }
        }, lodashContext.getImportVisitors());
    }
};