'use strict';

const test = require('tape');
const globby = require('globby');
const checksolution = require('../');

// Mocked data
const csprojDataMocked = [
    "test/src/Controllers/SearchController.cs",
    "test/src/Views/Home.cshtml",
    "test/src/Views/Search.cshtml",
    "test/src/Views/Search.cshtml",
    "test/src/Views/Index.cshtml",
    "test/src/Views/Item.cshtml"
];

// Mocked function
const parseCsprojMocked = function() {
    return new Promise((resolve, reject) => {

        resolve(csprojDataMocked);

    });
};


test('Parse csproj', function (t) {

    checksolution.parseCsproj()
                    .then(function(res) {
                        t.equal(res.length, 6, "Find 6 files in csproj");

                        t.end();
                    });

});


test('Check exist', function (t) {

     let file = globby.sync(csprojDataMocked[0]);

     t.ok(checksolution.checkExist(file), "This file exist: " + file);

     t.end();

});

test('Check duplicated', function(t) {
    
    let duplicated = csprojDataMocked.filter(checksolution.checkDuplicated);

    t.equal(duplicated.length, 1, "Find this duplicated file: " + duplicated);

    t.end();

});


test('Check integrity', function (t) {

    checksolution.parseCsproj = parseCsprojMocked;

    checksolution.checkIntegrity()
                    .then(res => {
                        t.equal(res.length, 6, "The function return correctly " + 6 + " files.");
                        t.end();
                    });

});

test('Check integrity', function (t) {

    checksolution.parseCsproj = parseCsprojMocked;

    checksolution.checkFiles("test/src/Controllers/**/*.cs")
                    .then(res => {
                        t.equal(res.length, 2, "Find " + res.length + " that are not included");
                        t.end();
                    })

});