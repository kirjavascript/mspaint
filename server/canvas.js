let Canvas = require('canvas');
let fs = require('fs');
let Image = Canvas.Image;
let { drawToContext } = require('../shared/workspace');
let { CANVAS } = require('../shared/constants');

let {width, height} = CANVAS;
let canvas, wss, room, ctx;

function initCanvas(wssInstance, roomInstance) {
    canvas = new Canvas(width, height);
    ctx = canvas.getContext('2d');
    wss = wssInstance;
    room = roomInstance;
    ctx.fillStyle = '#FFF';
    ctx.fillRect(0, 0, width, height);
    ctx.patternQuality = 'best';
    ctx.imageSmoothingEnabled = false;

    // load the canvas if there's a saved state
    // yes, the database for this thing is a png file
    fs.readFile('canvas.png', (err, png) => {
        if (png) {
            let img = new Image();
            img.src = png;
            ctx.drawImage(img, 0, 0, width, height);
        }
    });

    // save the canvas every so often
    setInterval(() => {
        canvas.toBuffer((err, buf) => {
            err && console.error(err);
            fs.writeFile('canvas.png', buf, 'utf8', (err, success) => {
                err && console.error(err);
            });
        })
    }, 2000);
}

function updateCanvas({ cmd, data, uid, ws }) {
    ws.broadcastObj({ cmd, data });
    drawToContext({ cmd, data, ctx });
}

function getPNG(cb) {
    canvas.toBuffer(cb);
}

module.exports = {
    initCanvas, updateCanvas, getPNG,
};
