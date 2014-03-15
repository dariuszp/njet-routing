'use strict';

var util = require('util'),
    pathInterpreter = require(__dirname + '/path.js'),
    route;

module.exports = route = {};


route.create = function (name, path, requirements, data) {
    return {
        name: String(name),
        path: String(path),
        regexp: pathInterpreter.toRegExp(path, requirements || {}),
        params: pathInterpreter.resolvePathRouteParams(path),
        defaults: pathInterpreter.resolveDefaultParamsValues(path),
        data: data || {}
    };
};

route.match = function (pathname, route) {
    pathname = String(pathname);
    if (!route instanceof Object && route.regexp) {
        throw new Error('Invalid route');
    }
    return route.regexp.test(pathname);
};

route.generate = function (route, params) {

};