/*=============================================>>>>>
= Check the integrity of csproj file =

= author: mantovanig =
===============================================>>>>>*/

"use strict";

// vendor modules
const fs = require("fs");
const chalk = require("chalk");
const figures = require("figures");
const log = console.log;

// libs modules
const response = require("./libs/response");
const parseCsproj = require("./libs/parseCsproj");
const compareFiles = require("./libs/compareFiles");
const checkDuplicated = require("./libs/checkDuplicated");

const csprojIntegrity = {
  checkExist(file) {
    try {
      fs.accessSync(file, fs.F_OK);
      return false;
    } catch (e) {
      return true;
    }
  },

  checkFiles(files) {
    log(chalk.white.bold(figures.bullet + " Check if files exist"), "\n");

    return parseCsproj()
      .then(fileIncludes => {
        return this.compareFiles(files, fileIncludes);
      })
      .then(function(result) {
        if (!result || result.length > 0) {
          log("");
          log(
            chalk.white.bgRed.bold(
              figures.warning + " Files that are not included: "
            )
          );
          result.map(e => log(chalk.yellow.underline(e)));
          log("");
          return Promise.reject(false);
        } else {
          log("");
          log(
            chalk.green.bold(figures.smiley + " OK! All files are included! ")
          );
          log("");
          return result;
        }
      })
      .catch(function(err) {
        return Promise.reject(false);
      });
  },

  checkIntegrity() {
    let status = {
      notFound: false,
      duplicated: false
    };

    return parseCsproj()
      .then(fileIncludes => {
        let fileNotFound = [];
        let duplicatedFiles = [];

        fileNotFound = fileIncludes.filter(this.checkExist);
        duplicatedFiles = fileIncludes.filter(checkDuplicated);

        status.notFound =
          !fileNotFound || fileNotFound.length > 0 ? true : false;

        status.duplicated =
          !duplicatedFiles || duplicatedFiles.length > 0 ? true : false;

        if (status.duplicated || status.notFound) {
          return Promise.resolve(
            response("error", "There are some problems in your csproj file", {
              fileNotFound,
              duplicatedFiles
            })
          );
        } else {
          return Promise.resolve(
            response("success", "OK! Your csproj file is good!", fileIncludes)
          );
        }
      })
      .catch(function(err) {
        return Promise.resolve(
          response("fail", "Failing during checking", err)
        );
      });
  }
};

module.exports = csprojIntegrity;
