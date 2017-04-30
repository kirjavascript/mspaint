let { CANVAS } = require('../constants');

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


function grabSquare({ x, y, dx, dy, ctx }, callback) {
    dx = dx | 0; dy = dy | 0; x = x | 0; y = y | 0;
    let [left, top] = [Math.min(x, x - dx), Math.min(y, y - dy)];
    let [width, height] = [dx, dy].map(Math.abs);

    // adjust for boundaries
    if (top < 0) {
        if (height < Math.abs(top)) return;
        let angle = Math.atan(width/height);
        let leftDiff = (Math.tan(angle) * (height/2))|0;
        height += top;
        left += (leftDiff*2);
        width -= leftDiff;
        top = 0;
    }
    if (left < 0) {
        if (width < Math.abs(left)) return;
        // width += left;
        left = 0;
    }

    // node bug

    let imgData = ctx.getImageData(left, top, width+1, height+1);

    let x0 = dx < 0 ? width : 0;
    let y0 = dy < 0 ? height : 0;

    callback({
        x: x0,
        y: y0,
        dx, dy,
        imgData,
        setPixel(x, y, colorData) {
            let [r, g, b] = colorData;
            let pos = ((y * (width+1)) + x) * 4;
            // console.log(x, y, pos, width, height);
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
    grabSquare,
};
