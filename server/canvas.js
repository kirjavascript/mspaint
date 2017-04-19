let Canvas = require('canvas');
let fs = require('fs');
let Image = Canvas.Image;
let { drawToContext, wrapBuffer } = require('../shared/canvas-tools');
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

    // load the canvas if there's a saved state
    fs.readFile('canvas.png', (err, png) => {
        if (png) {
            let img = new Image();
            img.src = png;
            ctx.drawImage(img, 0, 0, width, height);
        }
    });

    // save the canvas every so often
    setInterval(() => {
        fs.writeFile('canvas.png', canvas.toBuffer(), 'utf8', (err, success) => {
            err && console.error(err);
        });
    }, 5000);
}

function updateCanvas({ cmd, data, uid, ws }) {
    ws.broadcastObj({ cmd, data });
    drawToContext({ cmd, data, ctx });
}

function readCanvas() {
    let typedArray = ctx.getImageData(0, 0, width, height).data;
    return wrapBuffer('INIT', typedArray);
}

function getPNG() {
    return canvas.toBuffer();
}


module.exports = {
    initCanvas, updateCanvas, readCanvas, getPNG,
};
