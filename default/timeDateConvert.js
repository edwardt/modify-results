var _      = require('lodash');
var moment = require('moment');
var Util   = require('./Util.js');

module.exports = function(results, option) {
  var collection    = option.collection;
  var property      = option.property;
  var fromFormat    = option.fromFormat;
  var toFormat      = option.toFormat;

  _.forEach(results, function(e) {
    var oldval = Util.getPropByString(e, properties);
    var newval = moment(oldval, fromFormat).format(toFormat);
    Util.setPropByString(e, property, newval);
  });
};

