var util = require('util');

function InvalidConfigurationError(message) {
    this.name = 'InvalidConfigurationError';
    this.message = message;
}
util.inherits(InvalidConfigurationError, Error);
exports.InvalidConfigurationError = InvalidConfigurationError;

function CommandExecutionError(command, code, localStdout, localStderr) {
  this.name = 'CommandExecutionError';
  this.message = '"' + command + '" exited with code ' + code;
}
util.inherits(CommandExecutionError, Error);
exports.CommandExecutionError = CommandExecutionError;
