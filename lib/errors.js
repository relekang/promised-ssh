var util = require('util');

function InvalidConfigurationError(message) {
  this.name = 'InvalidConfigurationError';
  this.message = message;
}

util.inherits(InvalidConfigurationError, Error);
exports.InvalidConfigurationError = InvalidConfigurationError;

function ConnectionError(user, hostname) {
  this.name = 'ConnectionError';
  this.message = 'Unable to connect to ' + user + '@' + hostname;
}

util.inherits(ConnectionError, Error);
exports.ConnectionError = ConnectionError;

function CommandExecutionError(command, code, localStdout, localStderr) {
  this.name = 'CommandExecutionError';
  this.message = '"' + command + '" exited with code ' + code;
  this.command = command;
  this.code = code;
  this.stdout = localStdout;
  this.stderr = localStderr;
}

util.inherits(CommandExecutionError, Error);
exports.CommandExecutionError = CommandExecutionError;
