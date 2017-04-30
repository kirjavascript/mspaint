module.exports = function(str) {

    // #000
    if (str.length == 4) {
        return str.slice(1).split``.map((c) => parseInt(c+c, 16));
    }
    // #000000
    else if (str.length == 7) {
        return str.slice(1).match(/../g).map((c) => parseInt(c, 16));
    }
    // rgb / rgba
    else {
        return str.match(/\d+/g).splice(0,3);
    }

};
