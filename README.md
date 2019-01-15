# mls
NodeJS Multi-line Splitter

## Example

This is not very useful but it splits the stdin into a group of lines which is later pushed to stdout.

```
var mls = require('mls');

process.stdin.pipe(mls()).pipe(process.stdout);
```

A simple line counter

```
var mls = require('mls');

var lines = 0;
process.stdin
    .pipe(mls())
    .on('data', function (data) {
        lines += data.toString().split('\n').length - 1;
    })
    .on('end', function () {
        console.log(lines);
    });
```
