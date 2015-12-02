var tv4     = require('tv4')
var path    = require('path')
var fs      = require('fs')
var _       = require('lodash')

var files = fs.readdirSync(__dirname + '/lang')
files.forEach(function(file) {
  var name = path.basename(file, '.js');
  tv4.addLanguage(name, require(__dirname + "/lang/" + file))
})

module.exports = {
  language: function(code) {
    tv4.language(code);
  },
  validate: function(data, schema) {
    var schema = {
      required: schema.required,
      properties: _.pick(schema, _.without(_.keys(schema), 'required'))
    }
    var result = tv4.validateMultiple(data, schema);
    var error = {
      valid: result.valid,
      errors: [],
      missing: result.missing
    };
    if (result.valid) {
      return error;
    }
    result.errors.forEach(function(err) {
      var key = err.params.key;
      if(!key) {
        key = err.dataPath.slice(1);
      }
      error.errors.push({
        field: key,
        msg: err.message
      })
    })
    return error;
  }
}
