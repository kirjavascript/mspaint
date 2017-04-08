let Canvas = require('canvas');
let Image = Canvas.Image;
let { drawToContext, wrapBuffer } = require('../shared/canvas-tools');

let [width, height] = [1280,800];
let canvas, wss, room, ctx;

function initCanvas(wssInstance, roomInstance) {
    canvas = new Canvas(width, height);
    ctx = canvas.getContext('2d');
    wss = wssInstance;
    room = roomInstance;
}

function updateCanvas({ cmd, data, uid, ws }) {
    wss.broadcastObj({ cmd, data });
    drawToContext({ cmd, data, ctx });
}

function readCanvas() {
    let typedArray = ctx.getImageData(0, 0, width, height).data;
    return wrapBuffer('INIT', typedArray);
}


module.exports = {
    initCanvas, updateCanvas, readCanvas
};
