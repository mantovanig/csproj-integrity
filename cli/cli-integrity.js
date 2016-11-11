const checksolution = require('../index');
const program = require('commander');

program
  // .option('-f, --force', 'force installation')
  .parse(process.argv);

checksolution.checkIntegrity();
