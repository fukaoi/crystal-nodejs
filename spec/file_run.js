const fs = require('fs');
fs.readFile('spec/nodejs_spec.cr', 'utf8', (err, text) => {
    console.log('text file!');
    console.log(JSON.stringify({text: text}));
});
