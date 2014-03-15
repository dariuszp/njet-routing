'use strict';

require('should');

var route = require(__dirname + '/../src/route.js');

describe('route', function () {
    describe('.create()', function () {
        var newRoute = route.create('homepage', '/');
        it('should return route object when arguments are provided', function () {
            newRoute.should.be.instanceOf(Object);
            newRoute.should.have.property('name').and.be.instanceOf(String);
            newRoute.should.have.property('path').and.be.instanceOf(String);
            newRoute.should.have.property('regexp').and.be.instanceOf(RegExp);
            newRoute.should.have.property('params').and.be.instanceOf(Array);
            newRoute.should.have.property('defaults').and.be.instanceOf(Object);
            newRoute.should.have.property('data').and.be.instanceOf(Object);
        });
        it('should math path "/"', function () {
            route.match('/', newRoute).should.be.ok;
            route.match('/test', newRoute).should.not.be.ok;
        });
    });
});