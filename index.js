'use strict';

var verbRegister    = require(__dirname + '/src/verbRegister.js'),
    routeHandler    = require(__dirname + '/src/routeHandler.js'),
    pathHandler     = require(__dirname + '/src/pathHandler.js'),
    util            = require('util'),
    tools           = require('tools'),
    urlBase         = '%s://%s%s';

function Router(options) {
    if (!(this instanceof Router)) {
        return new Router(options);
    }

    var register = verbRegister.create(),
        scheme = 'http',
        host = 'localhost',
        baseUrl = '';

    this.setScheme = function (newScheme) {
        scheme = tools.trim(newScheme);
        return this;
    };

    this.getScheme = function () {
        return tools.trim(scheme);
    };

    this.setHost = function (newHost) {
        host = tools.trim(newHost);
        return this;
    };

    this.getHost = function () {
        return host;
    };

    this.setBaseUrl = function (newBaseUrl) {
        if (!newBaseUrl) {
            baseUrl = '';
            return this;
        }
        newBaseUrl = tools.trim(newBaseUrl, ' /');
        if (newBaseUrl.length) {
            baseUrl = '/' + String(newBaseUrl);
        } else {
            baseUrl = '';
        }
        return this;
    };

    this.getBaseUrl = function () {
        return baseUrl;
    };
}

module.exports = {

    createRouter: function (options) {
        return new Router(options);
    },
    verbRegister: verbRegister.VerbRegister,
    pathHandler: pathHandler,
    routeHandler: routeHandler

};