'use strict';

require('should');

var route = require(__dirname + '/../src/route.js');

describe('route', function () {
    describe('.create()', function () {
        var newRoute = route.create('homepage', '/test/{id}/{page}', {
            id: '[0-9]+',
            page: '[0-9]+'
        });
        it('should return route object when arguments are provided', function () {
            newRoute.should.be.instanceOf(Object);
            newRoute.should.have.property('name').and.be.instanceOf(String);
            newRoute.should.have.property('path').and.be.instanceOf(String);
            newRoute.should.have.property('method').and.be.instanceOf(String);
            newRoute.should.have.property('regexp').and.be.instanceOf(RegExp);
            newRoute.should.have.property('params').and.be.instanceOf(Array);
            newRoute.should.have.property('defaults').and.be.instanceOf(Object);
            newRoute.should.have.property('data').and.be.instanceOf(Object);
        });
        it('should math path "/test/5/2"', function () {
            route.match('/test/5/2', newRoute).should.be.ok;
            route.match('/test/5/2/', newRoute).should.not.be.ok;
            route.match('/test/test', newRoute).should.not.be.ok;
            route.match('/test/test/2', newRoute).should.not.be.ok;
            route.match('/test/test/test', newRoute).should.not.be.ok;
        });
    });

    describe('.generate()', function () {
        var newRoute = route.create('user_profile', '/user/{slug|półtorak dariusz!}/{page}/', {
            page: '[0-9+]'
        });

        it('should generate "/user/masta-blasta/5/"', function () {
            route.generate(newRoute, {
                slug: 'masta-blasta',
                page: 5
            }).should.equal('/user/masta-blasta/5/');
        });

        it('should have default value "półtorak dariusz!" for slug', function () {
            newRoute.defaults.slug.should.equal('półtorak dariusz!');
        });

        it('should add additional query string "name=darek" to path', function () {
            route.generate(newRoute, {
                slug: 'masta-blasta',
                page: 5,
                name: 'darek'
            }).should.equal('/user/masta-blasta/5/?name=darek');
        });
        it('should add additional query string "name=darek&surname=" to path', function () {
            route.generate(newRoute, {
                slug: 'masta-blasta',
                page: 5,
                surname: '',
                name: 'darek',
            }).should.equal('/user/masta-blasta/5/?name=darek&surname=');
        });
    });
});