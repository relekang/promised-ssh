var Bluebird = require('bluebird');
var util = require('util');
var Client = Bluebird.promisifyAll(require('ssh2').Client);

var errors = require('./errors');

function Connection(options) {
  this.host = options.host;
  this.username = options.username;
  this.debug = options.debug;
  this.options = options;
  this.options.failfast = this.options.failfast || true;
  this._connection = new Client();
  this._log('new connection');
}

Connection.prototype = {
  connect: function connect() {
    var _this = this;
    return new Bluebird(function connectPromise(resolve) {
      _this._connection.on('ready', function() {
        _this._log('ready');
        resolve(_this);
      }).connect(_this.options);
    });
  },

  exec: function exec(commands) {
    var _this = this;
    var stdout = '';
    var stderr = '';

    return Bluebird.each(commands, function(command) {
      return _this._connection.execAsync(command)
        .then(function(stream) {
          var localStdout = '';
          var localStderr = '';
          stream.on('data', function onStdout(data) {
            stdout += data;
            localStdout += data;
            if (_this.options.onStdout) _this.options.onStdout(data.toString());
          });

          stream.stderr.on('data', function onStderr(data) {
            stderr += data;
            localStderr += data;
            if (_this.options.onStderr) _this.options.onStderr(data.toString());
          });

          return new Bluebird(function(resolve, reject) {
            stream.on('close', function onClose(code, signal) {
              _this._log('closed "' + command + '" with exit code ' + code);
              if (code !== 0 && _this.options.failfast) {
                reject(new errors.CommandExecutionError(command, code, localStdout, localStderr));
              } else {
                resolve(_this._connection);
              }
            });
          });
        });
    }).then(function() {
      _this._log('closing connection');
      _this._connection.end();
      return [stdout, stderr];
    });
  },

  toString: function toString() {
    return this.username + '@' + this.host;
  },

  _log: function _log(message) {
    if (this.debug) console.log(this + ': ' + message);
  }
};

module.exports.Connection = Connection;

function MockConnection(options, mockOptions) {

  Connection.call(this, options);
  this.mockOptions = {
    commands: mockOptions.commands || {},
    failConnect: !!mockOptions.failConnect,
    throwIfMockNotDefined: mockOptions.throwIfMockNotDefined
  };
}

util.inherits(MockConnection, Connection);

MockConnection.prototype.connect = Bluebird.method(function connect() {
  if (this.mockOptions.failConnect)
    throw new errors.ConnectionError(this.options.user, this.options.hostname);
  return this;
});

MockConnection.prototype.exec = function exec(commands) {
  var _this = this;
  var stdout = '';
  var stderr = '';
  return Bluebird.each(commands, function(command) {
    if (command in _this.mockOptions.commands) {
      var commandOptions = _this.mockOptions.commands[command];

      if ('stdout' in commandOptions) {
        stdout += commandOptions.stdout;
        if (_this.options.onStdout) _this.options.onStdout(commandOptions.stdout);
      }

      if ('stderr' in commandOptions) {
        stderr += commandOptions.stderr;
        if (_this.options.onStderr) _this.options.onStderr(commandOptions.stderr);
      }

      if (commandOptions.fail) {
        throw new errors.CommandExecutionError(command, commandOptions.code, commandOptions.stdout, commandOptions.stderr);
      }

      return Bluebird.resolve(commandOptions.code || 0);

    } else {
      if (_this.mockOptions.throwIfMockNotDefined) {
        throw new Error('Mock for "' + command + '" not defined');
      }

      return ['', ''];
    }
  })
  .then(function() {
    return [stdout, stderr];
  });
};

module.exports.MockConnection = MockConnection;
