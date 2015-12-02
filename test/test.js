var restBodyChecker = require('../src/index.js');
var should = require('should');
var assert = require('assert');
var _      = require('lodash');

var schema ={
  firstName: {
    type: "string"
  },
  lastName: {
    type: "string"
  },
  age: {
    type: "integer",
    minimum: 0,
    maximum: 10
  },
  required: ["firstName", "lastName", "age"]
}

describe('Schema', function() {
  it('Test parse object must errors and error must contain required field', function() {
    var error = restBodyChecker.validate({}, schema);
    assert.equal(typeof(error), 'object');
    error.valid.should.equal(false);
    var fields = [];
    _.each(error.errors, function(err) {
      fields.push(err.field);
    });
    assert.equal(_.difference(fields, schema.required).length, 0);
  })
  it('Test parse object and not return errors', function() {
    var error = restBodyChecker.validate({
      firstName: "firstname",
      lastName: "lastName",
      age: 10
    }, schema);
    error.valid.should.equal(true);
    var fields = [];
    _.each(error.errors, function(err) {
      fields.push(err.field);
    });
    assert.equal(fields.length, 0);
  })
  it('Test parse object and check type is wrong', function() {
    var error = restBodyChecker.validate({
      firstName: 111,
      lastName: "lastName",
      age: 10
    }, schema);
    error.valid.should.equal(false);
    var fields = [];
    _.each(error.errors, function(err) {
      fields.push(err.field);
    });
    assert.equal(fields[0], "firstName");
    error.errors[0].msg.should.match(/number/);
  })
})

