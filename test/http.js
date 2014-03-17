'use strict';

require('should');

var njetRouting     = require(__dirname + '/../index.js'),
    http            = require('http'),
    querystring     = require('querystring'),
    server,
    serverPort      = 8100;

function testResponse(done, path, callback) {
    if (typeof callback !== 'function') {
        throw new Error('Invalid testResponse callback');
    }
    if (path === undefined) {
        path = '/';
    }
    path = String(path);

    var body = '';
    http.get({ host: "localhost", port: serverPort, path: path }, function (res) {
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            callback(res, body);
            done();
        });
    });
}

describe('http', function () {
    before(function (done) {
        server = http.createServer(function (req, res) {

            var router = njetRouting.createRouter();

            router.get.add('homepage', '/');

            router.get.add('rest_get_user', '/api/user/{slug}', {
                slug: '[a-z\\-]+'
            });

            var match = router[req.method.toLowerCase()].match(req.url);
            if (match === false) {
                res.writeHead(404, {"Content-Type": "text/plain"});
                res.end(JSON.stringify({ content: 'Not found - ' + req.method.toLowerCase() + ': ' + req.path }));
            } else {
                res.end(JSON.stringify(match));
            }
        });
        server.on("listening", function () {
            done();
        });
        server.listen(serverPort);
    });

    after(function (done) {
        server.close();
        done();
    });

    describe('server', function () {
        it('should return response 200 and route homepage', function (done) {
            testResponse(done, '/', function (res, body) {
                var data = JSON.parse(body.toString());
                res.statusCode.should.equal(200);

                data.should.have.property('route');
                data.route.should.have.property('name');
                data.route.name.should.equal('homepage');
            });
        });

        it('should return response 404 on path "/something-wrong"', function (done) {
            testResponse(done, '/something-wrong', function (res, body) {
                res.statusCode.should.equal(404);
            });
        });

        it('should return response 200 on path "/api/user/{slug}?name=półtorak dariusz"', function (done) {
            testResponse(done, '/api/user/dariuszp?' + querystring.stringify({ name: 'półtorak dariusz' }), function (res, body) {
                res.statusCode.should.equal(200);
                var data = JSON.parse(body.toString());

                data.should.have.property('route');
                data.route.should.have.property('name');
                data.route.name.should.equal('rest_get_user');

                data.should.have.property('routeParams');
                data.should.have.property('queryParams');
                data.should.have.property('params');

                data.routeParams.should.have.property('slug');
                data.routeParams.slug.should.equal('dariuszp');

                data.routeParams.should.not.have.property('name');
                data.queryParams.should.have.property('name');
                data.queryParams.name.should.equal('półtorak dariusz');

                data.routeParams.should.have.property('slug');
                data.queryParams.should.have.property('name');
            });
        });
    });

    describe('router', function () {

    });
});