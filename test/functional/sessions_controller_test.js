var assert = require('assert');
var supertest = require('supertest');
var app = require('./../../index.js');
var testServer = supertest(app);
var dbHelper = require('./../db_helper');
var User = require('./../../app/models/user');

describe('Sessions Controller', function () {
    var username = 'test123';
    var email = 'test@test.com';
    var password = '123';

    before(function (done) {
        dbHelper.deleteAllTables(function () {
            var user = new User({username: username, email: email, password: password});
            user.save(done);
        });
    });

    describe('POST /login', function () {
        it('should return 302 to /profile', function (done) {
            testServer
            .post('/login')
            .send({email: email, password: password})
            .end(function (err, res) {
                assert.equal(null, err);
                assert.equal(302, res.statusCode);

                var expectedPath = '/profile';
                assert.equal(expectedPath, res.headers.location);
                done();
            });
        });
    });
});

