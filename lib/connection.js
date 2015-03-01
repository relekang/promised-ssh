var Bluebird = require('bluebird');
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
    _this = this;
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
      return [code, stdout, stderr];
    });
  },

  toString: function toString() {
    return this.username + '@' + this.host;
  },

  _log: function _log(message) {
    if (this.debug) console.log(this + ': ' + message);
  }
};

module.exports = Connection;
