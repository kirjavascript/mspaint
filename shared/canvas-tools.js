function drawToContext({ ctx, data, cmd }) {
    
    let drawCmd = cmd.substr(7);

    if (drawCmd == 'PENCIL') {
        let { x, y, dx, dy, color } = data;

        ctx.beginPath();
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = color;
        ctx.moveTo(x - dx, y - dy);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
    }
    else if (drawCmd == 'BRUSH') {
        let { x, y, dx, dy, color, lineWidth } = data;

        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = color;
        ctx.moveTo(x - dx, y - dy);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
    }

    //     let radius = 5;
    //     cbel stagetx.beginPath();
    //     ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    //     ctx.fillStyle = 'green';
    //     ctx.fill();
    //
    //     selection/drag;
    //     should save imageData buffers and repaint them when requested
    //     d3-brush
}

// message passing via ArrayBuffers

let bufferCmds = [
    'INIT'
];

function wrapBuffer(cmd, buffer) {
    let out = new Uint8ClampedArray(buffer.length+1);
    out[0] = bufferCmds.findIndex((d)=>d==cmd);
    for (let i=0; i<buffer.length+1; i++) {
        out[i+1] = buffer[i];
    }
    return out;
}

function unwrapBuffer(buffer) {
    buffer = new Uint8ClampedArray(buffer);
    let index = buffer[0];
    let out = new Uint8ClampedArray(buffer.length-1);
    for (let i=0; i<buffer.length-1; i++) {
        out[i] = buffer[i+1];
    }
    return { cmd: bufferCmds[index], typedArray: out };
}

module.exports = {
    drawToContext, wrapBuffer, unwrapBuffer
};
