'use strict';

/*
Path converter turn any path into proper regexp
 */

// TODO: check route params from last to first. If delimeter "/" can be omitted, add ?. Same with route params. Default params should be omitted. Try to look out for params from last to first and check if next param is omited or there is only "/" after it
// TODO: we should allow ANY default parameter. Fix variableNameRegExpPattern and variableNameRegExp


var util                                    = require('util'),
    tools                                   = require(__dirname + '/tools.js'),
    trim                                    = tools.trim,
    escapeRegExp                            = tools.escapeRegExp,
    unEscapeRegExp                          = tools.unEscapeRegExp,
    path,
    variableNameRegExp                      = /\\\{ *([a-zA-Z]+)(\\\|([^\/}]+))? *\\\}/g,
    variableNameRegExpPattern               = '\\\\{ *%s(\\\\|([^\/}]+))? *\\\\}',
    variableNameRegExpPatternForNotEscaped  = '\\{ *%s(\\|([^\/}]+))? *\\}',
    variableRegExp                          = '[^\\/]+',
    variableRegExpPattern                   = '(%s%s)%s';

module.exports = path = {};

function extractRouteParamsFromPath(path, isNotEscaped) {
    if (isNotEscaped) {
        path = escapeRegExp(path);
    }
    var match = path.match(variableNameRegExp),
        routeParams = [],
        i;

    if (match) {
        for (i = 0; i < match.length; i++) {
            routeParams.push(trim(match[i], '{}|\\ ').replace(/^\s+/, '').replace(/\s+$/, '').replace('\\|', '|'));
        }
    }
    return routeParams;
}

function pathToRegExp(path, requirements) {
    path = escapeRegExp(String(path));
    if (!requirements) {
        requirements = {};
    }

    var routeParams = extractRouteParamsFromPath(path),
        defaultParam = '',
        i,
        paramName,
        regexpBase,
        arr,
        routeRegExp;

    for (i = 0; i < routeParams.length; i++) {
        arr             = routeParams[i].split('|');
        paramName       = trim(arr[0]);
        defaultParam    = trim(arr.splice(1).join('|'), ' |\\');
        regexpBase      = requirements[paramName] && String(requirements[paramName]).length ? requirements[paramName] : variableRegExp;
        routeRegExp     = util.format(variableRegExpPattern, regexpBase, defaultParam.length ? '|' + String(defaultParam) : '', '');
        path            = path.replace(new RegExp(util.format(variableNameRegExpPattern, escapeRegExp(paramName)), 'g'), routeRegExp);
    }
    return new RegExp('^' + String(path) + (path.split('').reverse()[0] === '/' ? '?$' : '$'));
}

path.toRegExp = function (path, requirements) {
    return pathToRegExp(path, requirements);
};

path.resolvePathRouteParams = function (path) {
    var params = extractRouteParamsFromPath(path, true),
        routeParams = [],
        i;
    for (i = 0; i < params.length; i++) {
        routeParams.push(params[i].split('|')[0]);
    }
    return routeParams.sort();
};

path.resolveDefaultParamsValues = function (path) {
    var params = extractRouteParamsFromPath(path, true),
        defaults = {},
        param,
        value,
        i;
    for (i = 0; i < params.length; i++) {
        param = params[i].split('|')[0];
        value = trim(params[i].split('|').splice(1).join('|'));
        if (value.length) {
            defaults[param] = unEscapeRegExp(value);
        }
    }
    return tools.sortObject(defaults);
};

path.replaceRouteParamByName = function (path, name, value) {
    path = String(path);
    name = escapeRegExp(String(name));
    var regexp = new RegExp(util.format(variableNameRegExpPatternForNotEscaped, escapeRegExp(name)), 'g');
    return path.replace(regexp, value);
};