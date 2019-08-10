const fs = require('fs');
const {output} = require('./output.js');
fs.readFile('spec/nodejs_spec.cr', 'utf8', (err, text) => {
    output('exec fs.readFile');
    toCrystal({text: text});
});
