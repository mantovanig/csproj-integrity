"use strict";

// vendors modules
const globby = require("globby");
const fs = require("fs");
const xml2js = require("xml2js");
const chalk = require("chalk");
const figures = require("figures");

// libs modules
const beautifyPath = require("./beautifyPath");

const log = console.log;

/**
 * Parse csproj file
 * 
 * @returns {promise}
 */
module.exports = function() {
    let cwd = process.cwd();

    let csproj = globby.sync(["*.csproj"]).map(e => {
      log(
        chalk.blue.bold(figures.info + " File csproj: "),
        chalk.white.underline(e)
      );
      return beautifyPath(cwd + "/" + e);
    });

    if (!csproj || csproj.length > 0) {
      var parser = new xml2js.Parser();
      var fileIncluded = [];

      return new Promise((resolve, reject) => {
        fs.readFile(csproj[0], (err, data) => {
          parser.parseString(data, (err, result) => {
            let itemgroups = result.Project.ItemGroup;

            if (!itemgroups || itemgroups.length === 0) {
              reject("No item groups found in csprojFile");
            }

            fileIncluded = itemgroups
              //Take only item groups <Compile>, <Content> and <TypeScriptCompile>
              .filter(
                item =>
                  item.Compile ||
                  item.Content ||
                  item.TypeScriptCompile ||
                  false
              )
              //Take only the object of itemgroup
              .map(item => {
                let a = [];

                if (item.Content) {
                  a = a.concat(item.Content);
                }
                if (item.Compile) {
                  a = a.concat(item.Compile);
                }
                if (item.TypeScriptCompile) {
                  a = a.concat(item.TypeScriptCompile);
                }

                return a;
              })
              .reduce((fileIncludes, itemsArray) => {
                fileIncludes = itemsArray
                  .map(item => item.$.Include)
                  .concat(fileIncludes);
                return fileIncludes;
              }, []);

            resolve(fileIncluded);
          });
        });
      });
    } else {
      return Promise.reject("ERR: csproj file not found");
    }
}