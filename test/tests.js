'use strict';

const test = require('tape');
const checksolution = require('../');


// Mocked data
const csprojDataMocked = [
    "src/Controllers/SearchController.cs",
    "src/Views/Home.cshtml",
    "src/Views/Search.cshtml",
    "src/Views/Search.cshtml",
    "src/Views/Index.cshtml",
    "src/Views/Item.cshtml"
];

// Mocked function
const parseCsprojMocked = function() {
    return new Promise(resolve => csprojDataMocked);
};


test('Parse csproj', function (t) {

    checksolution.parseCsproj()
                    .then(function(res) {
                        t.equal(res.length, 6, "Find 6 files in csproj");

                        t.end();
                    });

});


test('Check exist', function (t) {

     let file = csprojDataMocked[0];

     t.ok(checksolution.checkExist(file), "This file exist: " + file);

     t.end();

});

test('Check duplicated', function(t) {
    
    let duplicated = csprojDataMocked.filter(checksolution.checkDuplicated);

    t.equal(duplicated.length, 1, "Find this duplicated file: " + duplicated);

    t.end();

});


