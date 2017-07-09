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
    log(chalk.white.bold(figures.bullet + " Check Integrity"), "\n");

    let status = true;

    return parseCsproj()
      .then(fileIncludes => {
        let fileNotFound = [];
        let duplicatedFiles = [];
        fileNotFound = fileIncludes.filter(this.checkExist);
        duplicatedFiles = fileIncludes.filter(checkDuplicated);

        if (!fileNotFound || fileNotFound.length > 0) {
          status = false;
          log("");
          log(
            chalk.white.bgRed.bold(
              figures.warning + " There are files included that not exist: "
            )
          );
          fileNotFound.map(e => log(chalk.yellow.underline(e)));
          log("");
        }

        if (!duplicatedFiles || duplicatedFiles.length > 0) {
          status = false;
          log("");
          log(
            chalk.black.bgYellow.bold(
              figures.warning + " There are duplicated files in csproj file: "
            )
          );
          duplicatedFiles.map(e => log(chalk.yellow.underline(e)));
          log("");
        }

        if (status) {
          log("");
          log(
            chalk.green.bold(
              figures.smiley + " OK! csporj file integrity is good!"
            )
          );
          log("");
          return fileIncludes;
        } else {
          return Promise.reject(false);
        }
      })
      .catch(function(err) {
        return Promise.reject(false);
      });
  }
};

module.exports = csprojIntegrity;
