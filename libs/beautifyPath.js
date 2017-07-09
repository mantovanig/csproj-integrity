const path = require("path");

/**
 * Beautify path
 * 
 * @param {string} filepath 
 * @returns {string}
 */
module.exports = function(filepath) {
    return path.normalize(filepath);
}