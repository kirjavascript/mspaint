let { CANVAS } = require('../constants');
let { getPos, createWriter, colorConvert, grabSquare } = require('./util');

function line({ color, x, y, dx, dy, ctx }) {

    let colorData = colorConvert(color);

    grabSquare({ x, y, dx, dy, ctx })
        .then(({ x, y, dx, dy, write, setPixel}) => {
            bline({ x, y, dx, dy}, (x, y) => {
                setPixel(x, y, colorData);
            });
            write();
        });
}

function bline({ x, y, dx, dy }, callback) {
    let [x0, y0, x1, y1] = [
        x, y, x + dx, y + dy,
    ].map((d) => d|0);

    let _dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
    let _dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
    let err = (_dx>_dy ? _dx : -_dy)/2;

    for (;;) {
        callback(x0,y0);
        if (x0 === x1 && y0 === y1) break;
        let e2 = err;
        if (e2 > -_dx) { err -= _dy; x0 += sx; }
        if (e2 < _dy) { err += _dx; y0 += sy; }
    }
}

function rectLine({ color, size, x, y, dx, dy, ctx }) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(x - dx, y - dy);
    let x1,y1;
    if (dx > 0) {
        x1 = x - dx, y1 = y - dy;
    }
    else {
        x1 = x, y1 = y;
        x = x - dx, y = y - dy;
    }
    if ((dy < 0 && dx > 0) || (dy > 0 && dx <= 0)) {
        ctx.lineTo(x1-size,y1-size); // <^
        ctx.lineTo(x-size,y-size); // <^
        ctx.lineTo(x+size,y-size); // ^>
        ctx.lineTo(x+size,y+size); // v>
        ctx.lineTo(x1+size,y1+size); // v>
        ctx.lineTo(x1-size,y1+size); // <v
        ctx.lineTo(x1-size,y1-size); // <^
    }
    else {
        ctx.lineTo(x1+size,y1-size); // ^>
        ctx.lineTo(x+size,y-size); // ^>
        ctx.lineTo(x+size,y+size); // v>
        ctx.lineTo(x-size,y+size); // <v
        ctx.lineTo(x1-size,y1+size); // <v
        ctx.lineTo(x1-size,y1-size); // <^
        ctx.lineTo(x1+size,y1-size); // ^>
    }

    ctx.closePath();
    ctx.fill();
}

module.exports = {
    rectLine, line
};
