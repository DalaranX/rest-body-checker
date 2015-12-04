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
  country: {
    enum: ['cn', 'en']
  },
  required: ["firstName", "lastName", "age", "country"]
}

describe('Schema', function() {
  it('Test parse object must errors and error must contain required field', function() {
    var error = restBodyChecker.validate({}, schema);
    assert.equal(typeof(error), 'object');
    error.valid.should.equal(false);
    var fields = [];
    _.each(error.errors, function(err) {
      fields.push(err.path);
    });
    assert.equal(_.difference(fields, schema.required).length, 0);
  })
  it('Test parse object and not return errors', function() {
    var error = restBodyChecker.validate({
      firstName: "firstname",
      lastName: "lastName",
      age: 10,
      country: 'en'
    }, schema);
    error.valid.should.equal(true);
    var fields = [];
    _.each(error.errors, function(err) {
      fields.push(err.path);
    });
    assert.equal(fields.length, 0);
  })
  it('Test parse object and check type is wrong', function() {
    var error = restBodyChecker.validate({
      firstName: 111,
      lastName: "lastName",
      age: 10,
      country: 'en'
    }, schema);
    error.valid.should.equal(false);
    var fields = [];
    _.each(error.errors, function(err) {
      fields.push(err.path);
    });
    assert.equal(fields[0], "firstName");
    error.errors[0].message.should.match(/number/);
  })
  it('Test parse object and set language', function() {
    var error = restBodyChecker.validate({
      lastName: "lastName",
      age: 10,
      country: 'jp'
    }, schema, 'zh-CN');
    error.valid.should.equal(false);
    error.errors[0].message.should.match(/缺少必要字段/);
  })
  it('Test parse object and enum type is wrong', function() {
    var error = restBodyChecker.validate({
      firstName: 111,
      lastName: "lastName",
      age: 10,
      country: 'jp'
    }, schema);
    error.valid.should.equal(false);
  })
  it('Test date format', function() {
    var schema = {
      startDate: {
        type: 'string',
        format: 'date'
      },
      required: ['startDate']
    };
    var err = restBodyChecker.validate({}, schema)
    err.valid.should.equal(false);
    err = restBodyChecker.validate({'startDate': '2014-02-11'}, schema)
    err.valid.should.equal(true);
    err = restBodyChecker.validate({'startDate': '2015-10-29T16:00:00.000Z'}, {startDate: {type: 'string', format: 'datetime'}})
    err.valid.should.equal(true);
  })
  it('Test email format', function() {
    var schema = {
      email: {
        type: 'string',
        format: 'email'
      },
      required: ['email']
    };
    var err = restBodyChecker.validate({'email': 'test'}, schema)
    err.valid.should.equal(false);
    err = restBodyChecker.validate({'email': 'test@gmail.com'}, schema)
    err.valid.should.equal(true);
  })
})

