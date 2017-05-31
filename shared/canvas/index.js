let fillCanvas = require('./fill');
let { rectLine, line } = require('./lines');
let { getContext } = require('./util');

function drawToContext(obj) {

    // spray http://perfectionkills.com/exploring-canvas-drawing-techniques/#round-distribution
    let { cmd, message } = unwrap(obj);
    let ctx = getContext();

    let drawCmd = cmd.substr(7);

    if (drawCmd == 'PENCIL') {
        line(Object.assign({ ctx }, message));
    }
    else if (drawCmd == 'BRUSH') {
        let { x, y, dx, dy, color, size, shape } = message;

        if (shape == 'circle') {
            ctx.beginPath();
            ctx.lineWidth = size;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = color;
            ctx.moveTo(x - dx, y - dy);
            ctx.lineTo(x, y);
            ctx.closePath();
            ctx.stroke();
        }
        else if (shape == 'rect') {
            rectLine(Object.assign({ ctx }, message));
        }
        else if (shape == 'bkLine') {
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            let x1 = x - dx, y1 = y - dy;
            ctx.moveTo(x1+size, y1-size);
            ctx.lineTo(x+size, y-size);
            ctx.lineTo(x-size, y+size);
            ctx.lineTo(x1-size, y1+size);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
        else if (shape == 'fwLine') {
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            let x1 = x - dx, y1 = y - dy;
            ctx.moveTo(x1-size, y1-size);
            ctx.lineTo(x-size, y-size);
            ctx.lineTo(x+size, y+size);
            ctx.lineTo(x1+size, y1+size);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }
    else if (drawCmd == 'ERASE') {
        rectLine(Object.assign({ ctx }, message));
    }
    else if (drawCmd == 'FILL') {
        fillCanvas(Object.assign({ ctx }, message));
    }

}

// because we don't have object spread in node yet
function unwrap(obj) {
    let { cmd } = obj;
    let message = obj;
    delete message.cmd;
    return { cmd, message };
}

module.exports = {
    drawToContext,
};
