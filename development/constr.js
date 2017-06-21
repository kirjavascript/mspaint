let output;

// create write steam
let wStream = require('stream').Writable();
wStream._write = function (chunk, enc, next) {
    output += chunk;
    next();
};

// create faux logger
let logger = new console.Console(wStream, process.stderr);

module.exports = (obj) => {
    output = '';
    logger.log(obj);
    return output;
};
