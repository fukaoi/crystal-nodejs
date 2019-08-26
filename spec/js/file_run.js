const fs = require('fs');
const {disp} = require('./disp.js');
fs.readFile('spec/nodejs_spec.cr', 'utf8', (err, text) => {
    disp('exec fs.readFile');
    toCrystal({text: text});
});
