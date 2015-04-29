# promised-ssh
Promise wrapped ssh2

## Install
```
npm install --save promised-ssh
```

## Usage
#### `.connect(options)`
Takes a object with options similar to ssh2. This object is passed along
to ssh2 connect. It returns a promise of an `Connection`.

#### `.connectMock(options)`
Returns a `MockConnection` which behaves similarly to `Connection` except
it never tries to connect anywhere and the outcome of commands and the mocked
connection is determined by mock-options which can be set with `.setMockOptions`.

#### `.setMockOptions(options)`
Sets the options used to determine the outcome of `MockConnection.connect` and
`MockConnection.exec`. It takes an object with options. The possible options are:

* `failConnect` (boolean) - Tells whether `MockConnection.connect` should fail or not.
  Default is `false`. If this is true it will throw an `ConnectionError` which is
  exposed under errors.
* `commands` (object) - An object with information about return code, stdout and
  stderr that a command should give. All three options is optional and have the
  following defaults: code=0, stdout='', stderr=''. The default for the option
  is `{}`
* `throwIfMockNotDefined` (boolean) - Throw an error if exec is called
  on a command that doesn't have a mock output defined

Example
```javascript
ssh.setMockOptions({
  commands: {
    'cd project && make': {
      stdout: 'make: Nothing to be done for `all`.'
    }
  }
})
```

#### `.setOfflineMode(true)`
Will prevent any real connections from being made, causing an error to
be throwin instead. Useful when in test mode to make sure tests don't
trigger connections to remote servers.

### Connection
#### `Connection.connect()`
Returns a promise that resolves a `Connection`-object when ssh2 opens a connection.
`this.options` is used as connect options in ssh2.

#### `Connection.exec(list_of_commands)`
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
