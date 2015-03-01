var util = require('util');

function InvalidConfigurationError(message) {
    this.name = 'InvalidConfigurationError';
    this.message = message;
}
util.inherits(InvalidConfigurationError, Error);
exports.InvalidConfigurationError = InvalidConfigurationError;
