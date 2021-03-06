var tv      = require('tv4');
var path    = require('path');
var fs      = require('fs');
var _       = require('lodash');
var tv4formats = require('./tv4-formats');

function init(tv4) {
  var files = fs.readdirSync(__dirname + '/lang');
  files.forEach(function(file) {
    var name = path.basename(file, '.js');
    tv4.addLanguage(name, require(__dirname + "/lang/" + file))
  })
  tv4.addFormat(tv4formats);
}

module.exports = {
  validate: function(data, schema, lang) {
    tv4 = tv.freshApi()
    init(tv4)
    tv4.language(lang || 'cn')
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
        path: key,
        message: err.message
      })
    })
    return error;
  }
}
