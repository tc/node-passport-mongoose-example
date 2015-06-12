var assert = require('assert');
var supertest = require('supertest');
var app = require('./../../index');
var dbHelper = require('./../db_helper');
var testServer = supertest(app);

describe('Acccounts Controller', function () {
    before(function (done) {
        dbHelper.deleteAllTables(done);
    });

    describe('POST /signup', function () {
        it('should return 200', function (done) {
            var username = 'test123';
            var email = 'test@test.com';
            var password = '123';

            testServer
            .post('/signup')
            .send({username: username, email: email, password: password})
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


