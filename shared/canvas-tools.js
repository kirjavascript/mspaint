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
        let { x, y, dx, dy, color, size, shape } = data;

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
