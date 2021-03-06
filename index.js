'use strict';

var verbRegister    = require(__dirname + '/src/verbRegister.js'),
    routeHandler    = require(__dirname + '/src/route.js'),
    pathHandler     = require(__dirname + '/src/path.js'),
    util            = require('util'),
    tools           = require(__dirname + '/src/tools.js'),
    urlBase         = '%s://%s%s%s';

function Router(options) {
    if (!(this instanceof Router)) {
        return new Router(options);
    }

    var self = this,
        register = verbRegister.create(),
        scheme = 'http',
        host = 'localhost',
        port = 80,
        baseUrl = '',
        forcePortInUrl = false;

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

    this.setPort = function (newPort) {
        port = parseInt(newPort, 10);
        return this;
    };

    this.getPort = function () {
        return port;
    };

    this.forcePortInUrl = function (force) {
        forcePortInUrl = force ? true : false;
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

    this.generateUrl = function (name, routeParams, method, isAbsolute, urlPort) {
        method = method || 'get';
        urlPort = urlPort || port;
        urlPort = parseInt(urlPort, 10);

        var path = register.generatePath(name, routeParams, method),
            base = '';

        if (isAbsolute) {
            base = util.format(urlBase, scheme, host, ((urlPort !== 80 || forcePortInUrl) ? ':' + String(urlPort) : ''), baseUrl);
        }
        return base + path;
    };

    this.match = function (path, method) {
        return register.match(path, method);
    };

    this.dump = function (name, method) {
        return register.dump(name, method);
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
            generate: function (name, routeParams, isAbsolute, port) {
                return self.generateUrl(name, routeParams, verb, isAbsolute, port);
            },
            get: function (name) {
                return register.findByName(name, verb);
            },
            match: function (path) {
                return self.match(path, verb);
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