"use strict";

/**
 * Check duplicated - function for filter
 * 
 * @param {string} file 
 * @param {number} idx 
 * @param {array} files 
 * @returns {boolean}
 */
module.exports = function(file, idx, files) {
    return files.indexOf(file) !== idx;
}