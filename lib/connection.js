var Bluebird = require('bluebird');
var Client = Bluebird.promisifyAll(require('ssh2').Client);

var errors = require('./errors');

function Connection(options) {
  this.host = options.host;
  this.username = options.username;
  this.debug = options.debug;
  this.options = options;
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

  execCommand: function execCommand(command) {
    var _this = this;
    var stdout = '';
    var stderr = '';
    this._log('Exec command "' + command + '"');
    return this._connection
      .execAsync(command)
      .then(function (stream) {
        return new Bluebird(function (resolve) {
          stream.on('close', function onClose(code, signal) {
            _this._log('closed "' + command + '" with exit code ' + code);
            resolve([code, stdout, stderr]);
          });

          stream.on('data', function onStdout(data) {
            stdout += data;
          });

          stream.stderr.on('data', function onStderr(data) {
            stdout += data;
          });
        });
      })
      .then(function (result) {
        _this._log('closing connection');
        _this._connection.end();
        return result;
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
