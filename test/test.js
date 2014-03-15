'use strict';

require('should');

var path = require(__dirname + '/../src/path.js');

describe('path', function () {
    describe('.toRegExp()', function () {
        it('should return "test" when "test" is provided', function () {
            path.toRegExp('test').toString().should.equal('/^test/');
        });
        it('should return "\\/test" when "/test" is provided', function () {
            path.toRegExp('/test').toString().should.equal('/^\\/test/');
        });
        it('should return "\\/test\\/([^\\/]+)" when "/test/{id}" is provided', function () {
            path.toRegExp('/test/{id}').toString().should.equal('/^\\/test\\/([^\\/]+)/');
        });
        it('should return "\\/test\\/([^\\/|article]+)" when "/test/{id|article}" is provided', function () {
            path.toRegExp('/test/{id|article}').toString().should.equal('/^\\/test\\/([^\\/]+|article)/');
        });
        it('should return "\\/test\\/([^\\/|article]+)" when "/test/{ id|article }" is provided', function () {
            path.toRegExp('/test/{ id|article }').toString().should.equal('/^\\/test\\/([^\\/]+|article)/');
        });
        it('should return "\\/test\\/([^\\/|article]+)" when "/test/{ id | article }" is provided', function () {
            path.toRegExp('/test/{ id | article }').toString().should.equal('/^\\/test\\/([^\\/]+|article)/');
        });
        it('should return "\\/test\\/([^\\/|article]+)" when "/test/{id| article }" is provided', function () {
            path.toRegExp('/test/{id| article }').toString().should.equal('/^\\/test\\/([^\\/]+|article)/');
        });
        it('should return "\\/test\\/([^\\/|article]+)" when "/test/{ id |article}" is provided', function () {
            path.toRegExp('/test/{ id |article}').toString().should.equal('/^\\/test\\/([^\\/]+|article)/');
        });
        it('should return "\\/test\\/([^\\/|article]+)" when "/test/{id | article}" is provided', function () {
            path.toRegExp('/test/{id | article}').toString().should.equal('/^\\/test\\/([^\\/]+|article)/');
        });
        it('should return "\\/test\\/([^\\/|new article]+)" when "/test/{id| new article }" is provided', function () {
            path.toRegExp('/test/{id| new article }').toString().should.equal('/^\\/test\\/([^\\/]+|new article)/');
        });
        it('should return "\\/test\\/([^\\/|new article \\| nothing]+)" when "/test/{id| new article | nothing }" is provided', function () {
            path.toRegExp('/test/{id| new article | nothing }').toString().should.equal('/^\\/test\\/([^\\/]+|new article \\| nothing)/');
        });
    });
});