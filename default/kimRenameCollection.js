var _ = require('lodash');
var Util = require('./Util.js');

module.exports = function(config) {
  var data       = this.data;
  var collection = config.collection;
  var newname    = config.newname;

  var oldval = data[collection];
  delete data[collection];
  data[newname] = oldval;

  this.data = data;
  return this;
};