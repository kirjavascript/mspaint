let Canvas = require('canvas');
let fs = require('fs');
let Image = Canvas.Image;
let { drawToContext, wrapBuffer } = require('../shared/canvas-tools');
let { CANVAS } = require('../shared/constants');
let { exec } = require('child_process');

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
    fs.readFile('canvas.png', (err, png) => {
        if (png) {
            let img = new Image();
            img.src = png;
            ctx.drawImage(img, 0, 0, width, height);
        }
    });

    // save the canvas every so often
    setInterval(() => {
        let diff2 = new Date();
        canvas.toBuffer((err, buf) => {
            err && console.error(err);
            fs.writeFile('canvas.png', buf, 'utf8', (err, success) => {
                err && console.error(err);
                exec('pngquant --force -o canvas.min.png canvas.png', (err, stdout) => {
                    err && console.error(err);
                });
            });
        })
    }, 1000);
}

function updateCanvas({ cmd, data, uid, ws }) {
    ws.broadcastObj({ cmd, data });
    drawToContext({ cmd, data, ctx });
}

function readCanvas() {
    // deprecated
    let typedArray = ctx.getImageData(0, 0, width, height).data;
    return wrapBuffer('INIT', typedArray);
}

function getPNG(cb) {
    // canvas.toBuffer(cb);
    fs.readFile('canvas.min.png', (err, buf) => {
        cb(err, buf);
    });
}

module.exports = {
    initCanvas, updateCanvas, readCanvas, getPNG,
};
