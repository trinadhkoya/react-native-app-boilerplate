'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('./settingsUtil'),
    getSettings = _require.getSettings;

var _require2 = require('./astUtil'),
    isMethodCall = _require2.isMethodCall,
    isCallFromObject = _require2.isCallFromObject,
    getCaller = _require2.getCaller,
    getMethodName = _require2.getMethodName;

var _require3 = require('./importUtil'),
    getNameFromCjsRequire = _require3.getNameFromCjsRequire,
    isFullLodashImport = _require3.isFullLodashImport,
    getMethodImportFromName = _require3.getMethodImportFromName;

/* Class representing lodash data for a given context */


module.exports = function () {
    /**
     * Create a Lodash context wrapper from a file's RuleContext
     * @param {RuleContext} context
     */
    function _class(context) {
        _classCallCheck(this, _class);

        this.context = context;
        this.general = Object.create(null);
        this.methods = Object.create(null);
    }

    /**
     * Gets visitors to collect lodash declarations in the context
     * @returns {Object} visitors for every where Lodash can be declared
     */


    _createClass(_class, [{
        key: 'getImportVisitors',
        value: function getImportVisitors() {
            var self = this;
            return {
                ImportDeclaration: function ImportDeclaration(_ref) {
                    var source = _ref.source,
                        specifiers = _ref.specifiers;

                    if (isFullLodashImport(source.value)) {
                        specifiers.forEach(function (spec) {
                            switch (spec.type) {
                                case 'ImportNamespaceSpecifier':
                                case 'ImportDefaultSpecifier':
                                    self.general[spec.local.name] = true;
                                    break;
                                case 'ImportSpecifier':
                                    self.methods[spec.local.name] = spec.imported.name;
                                    break;
                            }
                        });
                    } else {
                        var method = getMethodImportFromName(source.value);
                        if (method) {
                            self.methods[specifiers[0].local.name] = method;
                        }
                    }
                },
                VariableDeclarator: function VariableDeclarator(_ref2) {
                    var init = _ref2.init,
                        id = _ref2.id;

                    var required = getNameFromCjsRequire(init);
                    if (isFullLodashImport(required)) {
                        if (id.type === 'Identifier') {
                            self.general[id.name] = true;
                        } else if (id.type === 'ObjectPattern') {
                            id.properties.forEach(function (prop) {
                                self.methods[prop.value.name] = prop.key.name;
                            });
                        }
                    } else if (required) {
                        var method = getMethodImportFromName(required);
                        if (method) {
                            self.methods[id.name] = method;
                        }
                    }
                }
            };
        }

        /**
         * Returns whether the node is an imported Lodash in this context
         * @param node
         * @returns {boolean|undefined}
         */

    }, {
        key: 'isImportedLodash',
        value: function isImportedLodash(node) {
            if (node && node.type === 'Identifier') {
                return this.general[node.name];
            }
        }

        /**
         * Returns the name of the Lodash method for this node, if any
         * @param node
         * @returns {string|undefined}
         */

    }, {
        key: 'getImportedLodashMethod',
        value: function getImportedLodashMethod(node) {
            if (node && node.type === 'CallExpression' && !isMethodCall(node)) {
                return this.methods[node.callee.name];
            }
        }

        /**
         * Returns whether the node is a call from a Lodash object
         * @param node
         * @returns {boolean|undefined}
         */

    }, {
        key: 'isLodashCall',
        value: function isLodashCall(node) {
            return this.pragma && isCallFromObject(node, this.pragma) || this.isImportedLodash(getCaller(node));
        }

        /**
         * Returns whether the node is an implicit chain start, _()...
         * @param node
         * @returns {boolean|undefined}
         */

    }, {
        key: 'isImplicitChainStart',
        value: function isImplicitChainStart(node) {
            return this.pragma && node.callee.name === this.pragma || this.isImportedLodash(node.callee);
        }

        /**
         * Returns whether the node is an explicit chain start, _.chain()...
         * @param node
         * @returns {boolean|undefined}
         */

    }, {
        key: 'isExplicitChainStart',
        value: function isExplicitChainStart(node) {
            return this.isLodashCall(node) && getMethodName(node) === 'chain';
        }

        /**
         * Returns whether the node is a Lodash chain start, implicit or explicit
         * @param node
         * @returns {*|boolean|boolean|undefined}
         */

    }, {
        key: 'isLodashChainStart',
        value: function isLodashChainStart(node) {
            return node && node.type === 'CallExpression' && (this.isImplicitChainStart(node) || this.isExplicitChainStart(node));
        }

        /**
         *
         * @returns {number} the current Lodash version
         */

    }, {
        key: 'version',
        get: function get() {
            if (!this._version) {
                var _getSettings = getSettings(this.context),
                    pragma = _getSettings.pragma,
                    version = _getSettings.version;

                this._pragma = pragma;
                this._version = version;
            }
            return this._version;
        }

        /**
         *
         * @returns {string|undefined} the current Lodash pragma
         */

    }, {
        key: 'pragma',
        get: function get() {
            if (!this._pragma) {
                var _getSettings2 = getSettings(this.context),
                    pragma = _getSettings2.pragma,
                    version = _getSettings2.version;

                this._pragma = pragma;
                this._version = version;
            }
            return this._pragma;
        }
    }]);

    return _class;
}();