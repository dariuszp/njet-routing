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

    this.generateUrl = function (name, routeParams, method, isAbsolute) {
        var path = verbRegister.generatePath(name, routeParams, method),
            base = '';

        if (isAbsolute) {
            base = util.format(urlBase, scheme, host, baseUrl);
        }
        return base + path;
    };

    this.match = function (path) {
        return register.match(path);
    };

    /**
     * Create setter for VERB methods
     * @param name
     * @returns {Function}
     */
    function createVerbSetter(verb) {
        return {
            add: function (name, path, requirements, data) {
                return register[verb](name, path, requirements, data);
            },
            generate: function (name, routeParams, isAbsolute) {
                return this.generateUrl(name, routeParams, verb, isAbsolute);
            },
            get: function (name) {
                return register.findByName(name, verb);
            }
        };
    }

    this.get = createVerbSetter('get');
    this.post = createVerbSetter('post');
    this.put = createVerbSetter('put');
    this['delete'] = createVerbSetter('delete');
    this.options = createVerbSetter('options');
    this.head = createVerbSetter('head');
    this.trace = createVerbSetter('trace');
    this.connect = createVerbSetter('connect');
    this.any = createVerbSetter('any');
}

module.exports = {

    createRouter: function (options) {
        return new Router(options);
    },
    verbRegister: verbRegister.VerbRegister,
    pathHandler: pathHandler,
    routeHandler: routeHandler

};