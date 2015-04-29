var Bluebird = require('bluebird');
var connection = require('./connection');
var errors = require('./errors');

var mockOptions = {},
    offlineMode = false;

module.exports.errors = errors;

module.exports.connect = function connect(options) {
  if (offlineMode) {
    throw new Error("Real connections to " + options.host + " are not allowed in offline mode");
  }
  return new connection.Connection(options).connect();
};

module.exports.connectMock = function connectMock(options) {
  return new connection.MockConnection(options, mockOptions).connect();
};

module.exports.setMockOptions = function setMockOptions(options) {
  mockOptions = options;
};

module.exports.setOfflineMode = function setOfflineMode(value) {
 offlineMode = !!value;
};
