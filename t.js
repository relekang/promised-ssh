var bluebird = require('bluebird');
var fs = bluebird.promisifyAll(require('fs'));
var path = require('path');
var ssh = require('./lib/ssh');

/*
** Usage example script. This requires a private key without password in ~/.ssh/test_key.
** Put hostname in the environment variabl HOST and user in USER.
**
** Example usage:
**  $ USER=rolf HOST=rolflekang.com node t.js
*/

fs
  .readFileAsync(path.join(process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE, '.ssh/test_key'))
  .then(function(key) {
    return ssh.connect({
      host: process.env.HOST,
      username: process.env.USER,
      privateKey: key,
      debug: true
    });
  })
  .then(function(connection) {
    return connection.exec(['ls -al', 'ls -al /']);
  })
  .spread(function(stdout, stderr) {
    if (stdout) console.log('STDOUT: ' + stdout);
    if (stderr) console.log('STDERR: ' + stderr);
  })
  .catch(console.error);
