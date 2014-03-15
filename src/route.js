'use strict';

var util = require('util'),
    pathInterpreter = require(__dirname + '/path.js'),
    route;

module.exports = route = {};


route.create = function (name, path, requirements, data) {
    var route = {};
    route[name] = {
        name: name,
        path: path,
        regexp: pathInterpreter.toRegExp(path, requirements || {}),
        params: pathInterpreter.resolvePathRouteParams(path),
        defaults: pathInterpreter.resolveDefaultParamsValues(path),
        data: data || {}
    };
    return route;
};

route.match = function (path, route) {

};
