'use strict';

var util                = require('util'),
    url                 = require('url'),
    pathInterpreter     = require(__dirname + '/path.js'),
    tools               = require(__dirname + '/tools.js'),
    querystring         = require('querystring'),
    querystring         = require('querystring'),
    route;

module.exports = route = {};


route.create = function (name, path, requirements, data, method) {
    if (!method) {
        method = 'get';
    }
    method = String(method).toLowerCase();
    return {
        name: String(name),
        path: String(path),
        method: method,
        regexp: pathInterpreter.toRegExp(path, requirements || {}),
        params: pathInterpreter.resolvePathRouteParams(path),
        defaults: pathInterpreter.resolveDefaultParamsValues(path),
        data: data || {}
    };
};

route.match = function (pathname, route) {
    pathname = String(pathname);
    if (!(route instanceof Object && route.regexp)) {
        throw new Error('Invalid route');
    }
    var parsedUrl = url.parse(pathname),
        match = String(parsedUrl.pathname || '').match(route.regexp),
        result,
        i,
        param,
        value;

    if (!match) {
        return false;
    }

    result = {
        route: route,
        queryParams: querystring.parse(parsedUrl.query || '') || {},
        routeParams: {},
        params: querystring.parse(parsedUrl.query || '') || {}
    };

    for (i = 0; i < route.params.length; i++) {
        param = route.params[i];
        value = match[i + 1];
        result.routeParams[param] = value;
        result.params[param] = value;
    }

    return result;
};

route.generate = function (route, routeParams) {
    var params = util._extend({}, routeParams || {});
    if (!(route && route instanceof Object)) {
        throw new Error('Invalid route: ' + String(route));
    }
    if (route.params.length === 0) {
        return route.path;
    }

    var path = route.path,
        i,
        value,
        param,
        query;

    for (i = 0; i < route.params.length; i++) {
        param = route.params[i];
        if (params[param]) {
            value = String(params[param]);
        } else {
            if (route.defaults[param]) {
                value = String(route.defaults[param]);
            } else {
                throw new Error('Value for param "' + String(param) + '" in route "' + String(route.name) + '" is missing');
            }
        }
        delete params[param];
        path = pathInterpreter.replaceRouteParamByName(path, param, value);
    }
    params = tools.sortObject(params);
    query = querystring.stringify(params);
    return String(path) + (query && query.length ? '?' + String(query) : '');
};