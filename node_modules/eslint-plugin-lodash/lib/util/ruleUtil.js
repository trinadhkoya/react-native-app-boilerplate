'use strict';

var assignWith = require('lodash/assignWith');
var mapValues = require('lodash/mapValues');
var over = require('lodash/over');

function combineVisitorObjects() {
    for (var _len = arguments.length, objects = Array(_len), _key = 0; _key < _len; _key++) {
        objects[_key] = arguments[_key];
    }

    var accumForAllVisitors = assignWith.apply(undefined, [{}].concat(objects, [function (objValue, sourceValue) {
        return (objValue || []).concat(sourceValue);
    }]));
    return mapValues(accumForAllVisitors, over);
}

module.exports = {
    combineVisitorObjects: combineVisitorObjects
};