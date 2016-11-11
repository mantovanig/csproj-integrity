# csproj-integrity
Node module for check the visual studio solution integrity parsing the csproj file.

You can use it with Grunt Plugin [grunt-csproj-integrity](https://github.com/mantovanig/grunt-csproj-integrity)

## Install

```
$ npm install --save-dev csproj-integrity
```


The module has 2 tasks:

### checkFiles
This task takes an array of path and check if all files are included in the .csproj file.

![alt tag](http://mantovanig.it/media/csproj.gif)

Usage example
```js
const csproj = require('csproj-integrity');


csproj.checkFiles(['Views/**/*.cshtml', 'Controllers/**/*.cs']);
```

### checkIntegrity
This task check if all file included in the csproj file actually exist.

![alt tag](http://mantovanig.it/media/csproj_task2.gif)

Usage example
```js
const csproj = require('csproj-integrity');


csproj.checkIntegrity();
```

## CLI commands

Install **csproj** command globally with

```bash
    npm install -g csproj-integrity
```

To check integrity of .csproj file move to the root of the file and run

```bash
    $ csproj integrity
```
To check local files are include in your csproj file run

```bash
    $ csproj files Views/**/*.js Controllers/**/*.cs
```

## TO DO
- Unit test with TAPE
- Gulp plugin
- Update readme with examp report
- CLI: Option to specify csproj file path
