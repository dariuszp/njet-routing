'use strict';

var routeHandler = require(__dirname + '/route.js');

function VerbRegister(options) {
    if (!(this instanceof VerbRegister)) {
        return new VerbRegister(options);
    }

    /**
     * HTTP methods with routes assigned to them
     * @type {{}}
     */
    var verbs = {};

    /**
     * HTTP methods with routes assigned to them by name
     * @type {{}}
     */
    var verbsByName = {};

    var allRoutes = [];

    /**
     * Create setter for VERB methods
     * @param name
     * @returns {Function}
     */
    function createVerbSetter(verb) {
        return function (name, path, requirements, data) {
            var route = routeHandler.create(name, path, requirements, data, verb.toLowerCase());

            if (!verbs[verb]) {
                verbs[verb] = [];
            }
            if (!verbsByName[verb]) {
                verbsByName[verb] = {};
            }
            if (verbsByName[verb][route.name]) {
                throw new Error('Route "' + String(route.name) + '" already registered!');
            }

            verbs[verb].push(route);
            verbsByName[verb][route.name] = route;
            allRoutes.push(route);

            return this;
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

    this.findByName = function (name, verbType) {
        var route;
        if (verbType) {
            route = verbsByName[verbType] && verbsByName[verbType][name] ? verbsByName[verbType][name] : false;
        } else {
            var i;
            route = false;
            for (i = 0; i < allRoutes.length; i++) {
                if (allRoutes[i] === name) {
                    route = allRoutes[i];
                    break;
                }
            }
        }
        return route;
    };

    this.math = function (path, verbType) {
        var route = false,
            i;
        if (verbType) {
            for (i = 0; i < verbs[verbType].length; i++) {
                if (routeHandler.match(path, verbs[verbType][i])) {
                    route = verbs[verbType][i];
                    break;
                }
            }
        } else {
            for (i = 0; i < allRoutes.length; i++) {
                if (routeHandler.match(path, allRoutes[i])) {
                    route = allRoutes[i];
                    break;
                }
            }
        }
        return route;
    };

    this.generatePath = function (name, routeParams, verbType) {
        return routeHandler.generate(this.findByName(name, verbType), routeParams || {});
    };
}

module.exports = {
    create: function (options) {
        return new VerbRegister(options || {});
    },
    VerbRegister: VerbRegister
};