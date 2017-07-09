const globby = require("globby");
const chalk = require("chalk");

const getDiff = require("./getDiff");


/**
 * Compare between local files and array of files
 * 
 * @param {string} path // path of local files
 * @param {array} files 
 * @returns {array}
 */
module.exports = function(path, files) {
    return new Promise(resolve => {
      globby(path).then(localfiles => {
        log(chalk.white.bold("\n", " Checking", localfiles.length, "files"));

        let diff = getDiff(localfiles, files);
        resolve(diff);
      });
    });
}