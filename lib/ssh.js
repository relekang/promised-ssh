var Bluebird = require('bluebird');
var Connection = require('./connection');

module.exports.connect = function connect(options) {
  return new Connection(options).connect();
};
