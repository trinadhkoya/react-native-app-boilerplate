'use strict';

var get = require('lodash/get');

function getNameFromCjsRequire(init) {
    if (get(init, 'callee.name') === 'require' && get(init, 'arguments.length') === 1 && init.arguments[0].type === 'Literal') {
        return init.arguments[0].value;
    }
}

var isFullLodashImport = function isFullLodashImport(str) {
    return (/^lodash(-es)?$/.test(str)
    );
};
var getMethodImportFromName = function getMethodImportFromName(str) {
    var match = /^lodash(-es\/|[./])(?!fp)(\w+)$/.exec(str);
    return match && match[2];
};

module.exports = {
    getNameFromCjsRequire: getNameFromCjsRequire, isFullLodashImport: isFullLodashImport, getMethodImportFromName: getMethodImportFromName
};