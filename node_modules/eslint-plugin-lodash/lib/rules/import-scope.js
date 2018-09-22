/**
 * @fileoverview Rule to disallow the use of a chain for a single method
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

var _require = require('../util/importUtil'),
    isFullLodashImport = _require.isFullLodashImport,
    getNameFromCjsRequire = _require.getNameFromCjsRequire,
    getMethodImportFromName = _require.getMethodImportFromName;

var getDocsUrl = require('../util/getDocsUrl');
var every = require('lodash/every');
var includes = require('lodash/includes');

var messages = {
    method: 'Import individual methods from the Lodash module.',
    member: 'Import members from the full Lodash module.',
    full: 'Use the full Lodash module.',
    'method-package': 'Import Lodash methods only from method packages (e.g. lodash.map)'
};

var importNodeTypes = {
    method: ['ImportDefaultSpecifier'],
    'method-package': ['ImportDefaultSpecifier'],
    member: ['ImportSpecifier'],
    full: ['ImportDefaultSpecifier', 'ImportNamespaceSpecifier']
};

var isMethodImport = function isMethodImport(name) {
    return getMethodImportFromName(name) && !includes(name, '.');
};
var isMethodPackageImport = function isMethodPackageImport(name) {
    return getMethodImportFromName(name) && includes(name, '.');
};
var allImportsAreOfType = function allImportsAreOfType(node, types) {
    return every(node.specifiers, function (specifier) {
        return includes(types, specifier.type);
    });
};

module.exports = {
    meta: {
        docs: {
            url: getDocsUrl('import-scope')
        },
        schema: [{
            enum: ['method', 'member', 'full', 'method-package']
        }]
    },

    create: function create(context) {
        var importType = context.options[0] || 'method';

        return {
            ImportDeclaration: function ImportDeclaration(node) {
                if (isFullLodashImport(node.source.value)) {
                    if (importType === 'method' || importType === 'method-package') {
                        context.report({ node: node, message: messages[importType] });
                    } else {
                        if (!allImportsAreOfType(node, importNodeTypes[importType])) {
                            context.report({ node: node, message: messages[importType] });
                        }
                    }
                } else if (isMethodImport(node.source.value) && importType !== 'method' || isMethodPackageImport(node.source.value) && importType !== 'method-package') {
                    context.report({ node: node, message: messages[importType] });
                }
            },
            VariableDeclarator: function VariableDeclarator(node) {
                var name = getNameFromCjsRequire(node.init);
                if (isFullLodashImport(name)) {
                    if (importType === 'method' || importType === 'method-package') {
                        context.report({ node: node, message: messages[importType] });
                    } else {
                        var isObjectPattern = node.id.type === 'ObjectPattern';
                        var isMemberImport = importType === 'member';
                        if (isObjectPattern !== isMemberImport) {
                            context.report({ node: node, message: messages[importType] });
                        }
                    }
                } else if (isMethodImport(name) && importType !== 'method' || isMethodPackageImport(name) && importType !== 'method-package') {
                    context.report({ node: node, message: messages[importType] });
                }
            }
        };
    }
};