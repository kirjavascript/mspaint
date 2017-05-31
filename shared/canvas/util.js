let { CANVAS } = require('../constants');

function getContext() {
    return (
        typeof __WEB__ != 'undefined'
        ? require('#js/workspace').getContext
        : require('../../server/canvas').getContext
    )();
}

function colorConvert(str) {

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

}

function pixelConvert(arr) {
    return '#' + [...arr].map((d) => {d = d.toString(16); return d.length>1?d:'0'+d;}).join``;
}


function grabSquare({ x, y, dx, dy, ctx }, callback) {
    dx = dx | 0; dy = dy | 0; x = x | 0; y = y | 0;
    let [left, top] = [Math.min(x, x - dx), Math.min(y, y - dy)];
    let [width, height] = [dx, dy].map(Math.abs);

    let x0 = dx < 0 ? width : 0;
    let y0 = dy < 0 ? height : 0;

    // adjust for boundaries (required for node-canvas)
    let overflowX = 0;
    let overflowY = 0;

    if (top < 0) {
        if (height <= Math.abs(top)) return;
        overflowY = top;
        height += top;
        top = 0;
    }
    if (left < 0) {
        if (width <= Math.abs(left)) return;
        overflowX = left;
        width += left;
        left = 0;
    }
    if (top + height > CANVAS.height) {
        let overflow = (top + height) - CANVAS.height;
        if (height <= overflow) return;
        height -= overflow;
    }
    if (left + width > CANVAS.width) {
        let overflow = (left + width) - CANVAS.width;
        if (width <= overflow) return;
        // not sure why not using a + 1 causes bugs here ¯\_(ツ)_/¯
        // (this still might be broken)
        width -= overflow + 1;
    }

    let imgData = ctx.getImageData(left, top, width+1, height+1);

    callback({
        x: x0,
        y: y0,
        dx,
        dy,
        setPixel(x, y, colorData) {
            let [r, g, b] = colorData;

            // adjust for overflow
            y += overflowY;
            x += overflowX;
            if (x < 0 || x >= width+1 || y < 0 || y >= height+1) return;

            let pos = ((y * (width+1)) + x) * 4;

            if (pos < 0 || pos >= imgData.length) return;

            imgData.data[pos] = r;
            imgData.data[pos+1] = g;
            imgData.data[pos+2] = b;
        },
        write() {
            ctx.putImageData(imgData, left, top);
        },
    });
}

function getPos(x, y) {
    return ((y * CANVAS.width) + x) * 4;
}

function createWriter(data, colorData) {
    let [r, g, b] = colorData;
    return (pos) => {
        data[pos|0] = r;
        data[(pos+1)|0] = g;
        data[(pos+2)|0] = b;
    };
}

function matchesSelected(data, x, y) {
    let initialPos = getPos(x, y);
    let selectedData = Array.from({length: 3}, (_, i) => data[initialPos + i]);

    return (pos) => (
        selectedData[0] == data[pos] &&
        selectedData[1] == data[pos+1] &&
        selectedData[2] == data[pos+2]
    );
}


module.exports = {
    getPos,
    createWriter,
    matchesSelected,
    colorConvert,
    pixelConvert,
    grabSquare,
    getContext,
};
