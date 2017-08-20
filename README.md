# csproj-integrity  
[![Build Status](https://travis-ci.org/mantovanig/csproj-integrity.svg?branch=master)](https://travis-ci.org/mantovanig/csproj-integrity) [![dependencies Status](https://david-dm.org/mantovanig/csproj-integrity/status.svg)](https://david-dm.org/mantovanig/csproj-integrity)
___

Node library for check the visual studio solution integrity parsing the csproj file.

You can use it with Grunt Plugin [grunt-csproj-integrity](https://github.com/mantovanig/grunt-csproj-integrity)

## Install
```bash
    npm install csproj-integrity --save-dev
```

## API

### **checkFiles**
This task takes an array of path and check if all files are included in the .csproj file.

`Arguments:` [string / array] - the globby path of files to check.

Output JSON
```json
{
    "status": [string] ["success", "error", "fail"],
    "message": [string],
    "data": [object]
}
```

In case of **success** the data is empty.

Usage example
```js
const csproj = require('csproj-integrity');

csproj
.checkFiles(['Views/**/*.cshtml', 'Controllers/**/*.cs'])
.then(res => {
    let response = JSON.parse(res);

    // your code
})
.catch(err => {
    console.log(err.message);
});
```

### **checkIntegrity**
This task check if all file included in the csproj file actually exist.

`No arguments.`

Output JSON
```json
{
    "status": [string] ["success", "error", "fail"],
    "message": [string],
    "data": [object]
}
```

If case of success the data is all file founded in csproj file.

Usage example
```js
const csproj = require('csproj-integrity');


csproj
.checkIntegrity()
.then(res => {
    let response = JSON.parse(res);

    // your code
})
.catch(err => {
    console.log(err.message);
});
```

## TO DO
- [x] Unit test with TAPE
- [x] Check of duplicated
- [ ] Gulp plugin
- [ ] CLI: Option to specify csproj file path
