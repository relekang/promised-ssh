# promised-ssh
Promise wrapped ssh2

```javascript
var ssh = require('promised-ssh');

ssh
  .connect({
    hostname: 'localhost',
    username: 'rolf',
  })
  .then(function (connection) {
    return connection.exec(['ls -al', 'ls non-existing-dir']);
  })
  .spread(function (return_code, stdout, stderr) {
    console.log('Returned with return code ' + return_code);
    if (stdout) console.log('STDOUT: ' + stdout);
    if (stderr) console.log('STDERR: ' + stderr);
  });
```
