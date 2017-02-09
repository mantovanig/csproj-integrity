'use strict';

const test = require('tape');
const checksolution = require('../');

test('Check integrity', function (t) {

    t.plan(3);

    checksolution.checkIntegrity()
                    .then(function(res) {
                        t.equal(res.length, 6, "Find 6 files in csproj");

                        let notFound = res.filter(checksolution.checkExist);

                        t.equal(notFound.length, 2, "2 file not found");

                        let duplicated = res.filter(checksolution.checkDuplicated);

                        t.equal(duplicated.length, 1, "Find 1 duplicated file");

                    });

});
