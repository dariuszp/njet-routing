'use strict';

require('should');

var routing = require(__dirname + '/../index.js');

describe('router', function () {
    var router = routing.createRouter();

    describe('.get.add()', function () {
        it('should add route "homepage"', function () {
            router.get.add('homepage', '/');
        });
    });

    describe('.get.get()', function () {
        it('should find route "homepage"', function () {
            router.get.get('homepage').should.be.instanceOf(Object);
            router.get.get('homepage').should.have.property('name');
            router.get.get('homepage').name.should.equal('homepage');
            router.get.get('homepage').path.should.equal('/');
        });
    });

    describe('.post.add()', function () {
        it('should add route "create_user"', function () {
            router.post.add('create_user', '/user/{username}');
            router.post.get('create_user').should.be.instanceOf(Object);
            router.post.get('destroy_user').should.equal(false);
        });
    });

    describe('.post.generate()', function () {
        it('should generate "/user/dariuszp?age=26"', function () {
            (function () {
                router.post.generate('create_user', {
                    username: 'dariuszp',
                    age: 26
                }).should.equal('/user/dariuszp?age=26');
            }).should.not.throw();
        });
        it('should throw Error when generating route using invalid name', function () {
            (function () {
                router.put.generate('something_wrong', {
                    username: 'dariuszp'
                });
            }).should.throw();
        });
    });

    describe('.setScheme() .setHost() .setBaseUrl()', function () {
        it('should generate url "https://dariuszp.com/my/base/user/dariuszp?age=26"', function () {
            router.setScheme('https').setHost('dariuszp.com').setBaseUrl('my/base');
            router.post.generate('create_user', {
                username: 'dariuszp',
                age: 26
            }, true).should.equal('https://dariuszp.com/my/base/user/dariuszp?age=26');
        });
    });
});