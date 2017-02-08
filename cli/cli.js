#!/usr/bin/env node

const program = require('commander');

program
  .version('1.0.0')
  .command('integrity', 'Check csproj files integrity', {isDefault: true}).alias('i')
  .command('files [glob]', 'Check if passed files are present inside csproj').alias('f')
  .parse(process.argv);

// checksolution.checkFiles();
// checksolution.checkIntegrity();
