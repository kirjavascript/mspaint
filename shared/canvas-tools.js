function drawToContext({ ctx, data, cmd }) {
    
    let drawCmd = cmd.substr(7);

    if (drawCmd == 'LINE') {
        let { x, y, dx, dy } = data;

        ctx.beginPath();
        ctx.lineWidth = 15;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.moveTo(x - dx, y - dy);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();

    }

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
