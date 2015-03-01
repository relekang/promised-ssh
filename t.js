var ssh = require('./lib/ssh');

/*
Usage example script. Put ssh2 compatible options object as a json dump
in the environment variable SSH_OPTIONS.
*/

ssh
  .connect(JSON.parse(process.env.SSH_OPTIONS))
  .then(function (connection) {
    return connection.execCommand('ls -al');
  })
  .spread(function (return_code, stdout, stderr) {
    console.log('Returned with return code ' + return_code);
    if (stdout) console.log('STDOUT: ' + stdout);
    if (stderr) console.log('STDERR: ' + stderr);
  })
  .catch(function error(error) {
    throw error;
  });
