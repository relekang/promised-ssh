# promised-ssh
Promise wrapped ssh2

## Usage
### `.connect(options)`
Takes a object with options similar to ssh2. This object is passed along
to ssh2 connect. It returns a promise of an `Connection`.

### `Connection.exec(list_of_commands)`
Takes a list of commands to run on the current connection. After the commands
have been runned the connection will be closed. It returns a promise of an array:
`[stdout, stderr]`.

### Example
```javascript
var ssh = require('promised-ssh');

ssh
  .connect({
    host: 'localhost',
    username: 'rolf',
    privateKey: '...'
  })
  .then(function(connection) {
    return connection.exec(['ls -al']);
  })
  .spread(function(stdout, stderr) {
    console.log('Returned with return code ' + return_code);
    if (stdout) console.log('STDOUT: ' + stdout);
    if (stderr) console.log('STDERR: ' + stderr);
  })
  .catch(function(error) {
    // error is here an instance of ssh.errors.CommandExecutionError
    // it contains information about exit code, stdout and stderr
    throw error;
  });
```
