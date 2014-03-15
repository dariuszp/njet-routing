'use strict';

/*
Path converter turn any path into proper regexp
 */

// TODO: check route params from last to first. If delimeter "/" can be omitted, add ?. Same with route params. Default params should be omitted. Try to look out for params from last to first and check if next param is omited or there is only "/" after it


var util = require('util'),
    path,
    variableNameRegExp = /\\\{ *([a-zA-Z]+[a-zA-Z0-9_\\| ]*) *\\\}/g,
    variableNameRegExpPattern = '\\\\{ *%s[a-zA-Z0-9_\\\\| ]* *}',
    variableRegExp = '[^\\/]+',
    variableRegExpPattern = '(%s%s)%s';

module.exports = path = {};

function trim(str, charlist) {
    var whitespace, l = 0,
        i = 0;
    str += '';

    if (!charlist) {
        // default list
        whitespace =
            ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
    } else {
        // preg_quote custom list
        charlist += '';
        whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
    }

    l = str.length;
    for (i = 0; i < l; i++) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(i);
            break;
        }
    }

    l = str.length;
    for (i = l - 1; i >= 0; i--) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(0, i + 1);
            break;
        }
    }

    return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
}

function escapeRegExp(string){
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function extractRouteParamsFromPath(path, isNotEscaped) {
    if (isNotEscaped) {
        path = escapeRegExp(path);
    }
    var match = path.match(variableNameRegExp),
        routeParams = [],
        i;

    if (match) {
        for (i = 0; i < match.length; i++) {
            routeParams.push(trim(match[i], '{}|\\ ').replace(/\s+/, '').replace('\\|', '|'));
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
    return routeParams;
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
            defaults[param] = value;
        }
    }
    return defaults;
};