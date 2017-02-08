'use strict';

// const test = require('tape');
const checksolution = require('../');

// test('all file is included', function (t) {

    // checksolution
    //       .checkFiles(['test/src/Views/**/*.cshtml'])
    //       .then(function(result) {
    //         console.log('eccoli' , result);
    //         return result;
    //       });

checksolution.checkIntegrity();


// });
