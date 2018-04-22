
var http = require('http');
var assert = require('chai').assert;
describe('http tests', function(){
    it('should return the login if the url is correct', function(done){
        http.get('http://localhost:3001/', function(res, err) {
            if (err) done(err);
            assert.equal(200, res.statusCode);
            done();
        })
    });
});


var http = require('http');
var assert = require('chai').assert;
describe('http tests', function(){
    it('should return the project if the url is correct', function(done){
        http.get('http://localhost:3001/', function(res, err) {
            if (err) done(err);
            assert.equal(200, res.statusCode);
            done();
        })
    });
});


var http = require('http');
var assert = require('chai').assert;
describe('http tests', function(){
    it('should return the user if the url is correct', function(done){
        http.get('http://localhost:3001/', function(res, err) {
            if (err) done(err);
            assert.equal(200, res.statusCode);
            done();
        })
    });
});


var http = require('http');
var assert = require('chai').assert;
describe('http tests', function(){
    it('should return the list of employer if the url is correct', function(done){
        http.get('http://localhost:3001/', function(res, err) {
            if (err) done(err);
            assert.equal(200, res.statusCode);
            done();
        })
    });
});


var http = require('http');
var assert = require('chai').assert;
describe('http tests', function(){
    it('should return the sign up ack if the url is correct', function(done){
        http.get('http://localhost:3001/', function(res, err) {
            if (err) done(err);
            assert.equal(200, res.statusCode);
            done();
        })
    });
});