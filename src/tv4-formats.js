var moment  = require('moment')
var validator = require('validator');

var dateTimeRegExp =  /[0-9]{4,}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(?:\.[0-9]+|)(?:[+-][0-9]{2}:[0-9]{2}|Z)/;
var durationRegExp = function() {
  var amount = '[\\.,0-9]+';
  return new RegExp(
    '^P(' + amount + 'Y|)(' + amount + 'M|)(' + amount + 'W|)(' + amount + 'D|)' +
    '(T(' + amount + 'H|)(' + amount + 'M|)(' + amount + 'S|))?$'
  );
}

exports.date = function(value) {
  if (typeof value === 'string' &&
      durationRegExp().test(value) &&
      moment(value, 'YYYY-MM-DD').isValid()) {
    return null;
  }
}

exports.datetime = function(value) {
  if (
    typeof value === 'string' &&
    dateTimeRegExp.test(value) &&
    moment(value).isValid()
  ) {
    return null;
  }
  return 'A valid ISO 8601 date/time string expected';
}

exports.email = function (value) {
  if (validator.isEmail(value)) {
    return null;
  }
  return 'E-mail address expected';
};
