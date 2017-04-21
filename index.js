'use strict';

/*=============================================>>>>>
= Check VS Includes of Solution =

= author: mantovanig =
===============================================>>>>>*/

/*----------- Base require -----------*/
const globby = require('globby');
const fs = require('fs');
const xml2js = require('xml2js');
const _ = require('lodash');
const path = require('path');
const chalk = require('chalk');
const figures = require('figures');
const log = console.log;


/*----------- Main module -----------*/
var checksolution = {

    parseCsproj() {
        // find csprof file

        let cwd = process.cwd();

        let csproj = globby
                        .sync(['*.csproj'])
                        .map((e) => {
                            log( chalk.blue.bold(figures.info + ' File csproj: '), chalk.white.underline(e));
                            return this.beautifyPath(cwd + '/' + e);
                        });

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
                                                    .map((item) => item.$.Include)
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

        log(chalk.white.bold(figures.bullet + ' Check if files exist'), "\n");

        return this.parseCsproj()
            .then((fileIncludes) => {
                return this.compareFiles(files, fileIncludes);
            })
            .then(function (result) {
                
                if (!result || result.length > 0) {
                    log('');
                    log(chalk.white.bgRed.bold(figures.warning + ' Files that are not included: '));
                    result.map((e) => log(chalk.yellow.underline(e)));
                    log('');
                    return result;
                    process.exit(1);
                } else {
                    log('');
                    log(chalk.green.bold(figures.smiley + ' OK! All files are included! '));
                    log('');
                    return result;
                }

            })
            .catch(function(err) {
                log(chalk.white.bgRed.bold(err));
                process.exit(1);
            });

    },

    checkDuplicated(file, idx, files) {
        return files.indexOf(file) !== idx;
    },

    checkIntegrity() {
        log(chalk.white.bold(figures.bullet + ' Check Integrity'), "\n");
        
        let status = true;

        return this.parseCsproj()
            .then((fileIncludes) => {
                let fileNotFound = [];
                let duplicatedFiles = [];
                fileNotFound = fileIncludes.filter(this.checkExist);
                duplicatedFiles = fileIncludes.filter(this.checkDuplicated);

                if (!fileNotFound || fileNotFound.length > 0) {
                    status = false;
                    log('');
                    log(chalk.white.bgRed.bold(figures.warning + ' There are files included that not exist: '));
                    fileNotFound.map((e) => log(chalk.yellow.underline(e)));
                    log('');
                }

                if(!duplicatedFiles || duplicatedFiles.length > 0) {
                    status = false;
                    log('');
                    log(chalk.black.bgYellow.bold(figures.warning + ' There are duplicated files in csproj file: '));
                    duplicatedFiles.map((e) => log(chalk.yellow.underline(e)));
                    log('');
                }

                if(status) {
                    log('');
                    log(chalk.green.bold(figures.smiley + ' OK! csporj file integrity is good!'));     
                    log('');
                    return fileIncludes;
                } else {
                    return fileIncludes;
                    process.exit(1);
                }

            })
            .catch(function(err) {
                log(chalk.white.bgRed.bold(figures.warning + " " + err));
                process.exit(1);
            });

    }
};

module.exports =  checksolution
