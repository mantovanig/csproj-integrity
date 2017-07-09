// vendors modules
const _ = require("lodash");

// libs modules
const beautifyPath = require("./beautifyPath");

/**
 * Get Diff - find difference between 2 array
 * 
 * @param {array} parent1 
 * @param {array} parent2 
 * @returns {array}
 */
module.exports = function(parent1, parent2) {
    return _.difference(
      parent1.map(beautifyPath),
      parent2.map(beautifyPath)
    );
}