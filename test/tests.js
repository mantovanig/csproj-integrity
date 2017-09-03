"use strict";

// vendor modules
const test = require("tape");
const globby = require("globby");

// libs modules
const parseCsproj = require("../libs/parseCsproj");
const checkDuplicated = require("../libs/checkDuplicated");

// main module
const csprojIntegrity = require("../");

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

test("Parse csproj", function(t) {
  parseCsproj().then(function(res) {
    t.equal(res.length, 6, "Find 6 files in csproj");

    t.end();
  });
});

test("Check exist", function(t) {
  let file = globby.sync(csprojDataMocked[0]);

  t.ok(csprojIntegrity.checkExist(file), "This file exist: " + file);

  t.end();
});

test("Check duplicated", function(t) {
  let duplicated = csprojDataMocked.filter(checkDuplicated);

  t.equal(duplicated.length, 1, "Find this duplicated file: " + duplicated);

  t.end();
});

test("Check integrity", function(t) {
  csprojIntegrity.parseCsproj = parseCsprojMocked;

  csprojIntegrity
    .checkIntegrity()
    .then(res => {
      let response = JSON.parse(res);
      t.equal(response.data.fileNotFound.length, 2, "Find " + response.data.fileNotFound.length + " files that are not included");
      t.equal(response.status, "error", "Status is error!");
      t.end();
    })
    .catch(err => {
      t.equal(err, false, "The function find errors");
      t.end();
    });
});

test("Check files", function(t) {
  csprojIntegrity.parseCsproj = parseCsprojMocked;

  csprojIntegrity
    .checkFiles("test/src/Controllers/**/*.cs")
    .then(res => {
      let response = JSON.parse(res);
      t.equal(response.data.length, 2, "Find " + response.data.length + " that are not included");
      t.equal(response.status, "error", "Status is error!")
      t.end();
    })
    .catch(err => {
      t.equal(err, false, "The function find errors");
      t.end();
    });
});
