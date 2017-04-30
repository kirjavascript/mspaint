// CURRENTLY UNUSED //


if (e.data instanceof ArrayBuffer) {
    // let { cmd, typedArray } = unwrapBuffer(e.data);

    // if (cmd == 'INIT') {
    //     let imageData = ctx.createImageData(width, height);
    //     imageData.data.set(typedArray);
    //     ctx.putImageData(imageData, 0, 0);
    //     canvas.style('opacity', 1);
    // }

    return;
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

function readCanvas() {
    // deprecated
    let typedArray = ctx.getImageData(0, 0, width, height).data;
    return wrapBuffer('INIT', typedArray);
}


