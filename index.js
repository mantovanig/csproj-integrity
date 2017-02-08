'use strict';

/*=============================================>>>>>
= Check VS Includes of Solution =
===============================================>>>>>*/

/*----------- Base require -----------*/
const globby = require('globby');
const fs = require('fs');
const xml2js = require('xml2js');
const _ = require('lodash');
const path = require('path');
const chalk = require('chalk');
const log = console.log;


/*----------- Main module -----------*/
var checksolution = {

    parseCsproj() {
        // find csprof file

        let cwd = process.cwd();

        let csproj = globby
                        .sync(['*.csproj'])
                        .map((e) => {
                            log( chalk.white.bgBlue.bold('File csproj: '), chalk.white.bold(e));
                            return this.beautifyPath(cwd + '/' + e);
                        })
        log(csproj);

        if (!csproj || csproj.length > 0) {

            var parser = new xml2js.Parser();
            var fileIncluded = [];

            return new Promise((resolve, reject) => {
                fs.readFile(csproj[0], (err, data) => {
                    parser.parseString(data, (err, result) => {
                        let itemgroups = result.Project.ItemGroup;

                        if (!itemgroups || itemgroups.length === 0) {
                            reject('No item groups found in csprojFile');
                        }


                        fileIncluded = itemgroups
                            //Take only item groups <Compile>, <Content> and <TypeScriptCompile>
                            .filter( (item) => item.Compile || item.Content || item.TypeScriptCompile || false )
                            //Take only the object of itemgroup
                            .map( (item) => {

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
                                                    .map((item) => { 
                                                        log(this.beautifyPath(item.$.Include));
                                                        return item.$.Include;
                                                    })
                                                    .concat(fileIncludes);
                                return fileIncludes;
                            }, []);

                        resolve(fileIncluded);
                    });
                });
            });

        } else {
            return Promise.reject('ERR: csproj file not found');
        }

    },

    beautifyPath(filepath) {
        return path.normalize(filepath);
    },

    findDiff(parent1, parent2) {

        return  _.difference( parent1.map(this.beautifyPath), parent2.map(this.beautifyPath));
    },

    compareFiles(path, files) {
        return new Promise(
             (resolve) => {

                globby(path).then((localfiles) => {

                    log(chalk.white.bold("\n", ' Checking', localfiles.length, 'files'));

                    let diff = this.findDiff( localfiles, files);
                    resolve(diff);
                });

            }
        );
    },

    checkExist(file) {
        try {
            fs.accessSync(file, fs.F_OK);
                // log(chalk.white.bold('exist', file));
                return false;
            } catch (e) {
            // It isn't accessible
                return true;
        }
    },

    checkFiles(files) {

        log(chalk.white.bold('# Check if files exist'), "\n");

        return this.parseCsproj()
            .then((fileIncludes) => {
                return this.compareFiles(files, fileIncludes);
            })
            .then(function (result) {
                if (!result || result.length > 0) {
                    log('');
                    log(chalk.white.bgRed.bold('## Files that are not included: '));
                    result.map((e) => log(chalk.yellow.underline(e)));
                } else {
                    log('');
                    log(chalk.white.bgGreen.bold('## OK! All files are included! '));
                }

                return result;
            })
            .catch(function(err) {
                log(chalk.white.bgRed.bold(err));
            });

    },

    checkDuplicated(file, idx, files) {
        return files.indexOf(file) !== idx;
    },

    checkIntegrity() {
        log(chalk.white.bold('# Check Integrity'), "\n");

        return this.parseCsproj()
            .then((fileIncludes) => {
                let fileNotFound = [];
                let duplicatedFiles = [];
                fileNotFound = fileIncludes.filter(this.checkExist);

                log(chalk.white.bold('# Checking duplicated files'), "\n");
                duplicatedFiles = fileIncludes.filter(this.checkDuplicated);

                log("duplicati", duplicatedFiles);

                if (!fileNotFound || fileNotFound.length > 0) {
                    log('');
                    log(chalk.white.bgRed.bold('## There are files included that not exist: '));
                    fileNotFound.map((e) => log(chalk.yellow.underline(e)));
                } else {
                    log('');
                    log(chalk.white.bgGreen.bold('## OK! All files included exist! '));
                }

                return fileIncludes;
            })
            .catch(function(err) {
                log(chalk.white.bgRed.bold(err));
            });

    }
};

module.exports =  checksolution
