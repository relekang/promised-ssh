var Bluebird = require('bluebird');
var connection = require('./connection');
var errors = require('./errors');

var mockOptions = {};

module.exports.errors = errors;

module.exports.connect = function connect(options) {
  return new connection.Connection(options).connect();
};

module.exports.connectMock = function connectMock(options) {
  return new connection.MockConnection(options, mockOptions).connect();
};

module.exports.setMockOptions = function setMockOptions(options) {
  mockOptions = options;
};
