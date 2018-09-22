/**
 * @fileoverview Rule to ensure a lodash chain ends
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

var getDocsUrl = require('../util/getDocsUrl');

module.exports = {
    meta: {
        docs: {
            url: getDocsUrl('unwrap')
        }
    },

    create: function create(context) {
        var _require = require('../util/lodashUtil'),
            getLodashContext = _require.getLodashContext,
            isChainable = _require.isChainable,
            isCallToMethod = _require.isCallToMethod,
            isChainBreaker = _require.isChainBreaker;

        var _require2 = require('../util/astUtil'),
            getCaller = _require2.getCaller;

        var negate = require('lodash/negate');
        var lodashContext = getLodashContext(context);
        var version = lodashContext.version;
        function isCommit(node) {
            return isCallToMethod(node, version, 'commit');
        }

        function getEndOfChain(node, isExplicit) {
            var stillInChain = isExplicit ? negate(isChainBreaker) : isChainable;
            var curr = node.parent.parent;
            while (curr === getCaller(curr.parent.parent) && stillInChain(curr, version)) {
                curr = curr.parent.parent;
            }
            return curr;
        }

        var visitors = lodashContext.getImportVisitors();
        visitors.CallExpression = function (node) {
            if (lodashContext.isImplicitChainStart(node)) {
                var end = getEndOfChain(node, false);
                if (!isCommit(end) && isChainable(end, version)) {
                    context.report({ node: end, message: 'Missing unwrapping at end of chain' });
                }
            } else if (lodashContext.isExplicitChainStart(node)) {
                var _end = getEndOfChain(node, true);
                if (!isCommit(_end) && !isChainBreaker(_end, version)) {
                    context.report({ node: _end, message: 'Missing unwrapping at end of chain' });
                }
            }
        };
        return visitors;
    }
};