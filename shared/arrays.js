// Custom format for crushing object data to send over the wire

// 52.3kB

setTimeout(() => {

    let data = {
        cmd: 'CANVAS_FILL',
        uid: Math.random().toString(36).slice(7),
    };

    let sfd = JSON.stringify(data);
    let packed = pack(data);
    let unpacked = JSON.stringify(unpack(packed));

    console.log(`
        stringified: ${sfd}
        length: ${sfd.length} chars (UTF-16)

        packed: ${packed}
        length: ${packed.length} bytes

        unpacked: ${unpacked}

        status: ${unpacked == sfd ? 'PASS' : 'FAIL'}
    `);

});
//

let { pixelConvert, colorConvert } = require('./canvas/util');

// lookup table for commands

let commands = ['RELOAD','JOIN','PART','LIST','COLOR','PING','PONG','XY','CANVAS_FILL','CANVAS_PENCIL','CANVAS_BRUSH','CANVAS_ERASE'];

// schema definition

let properties = [
    {name: 'uid', string: 1},
];

// command is stored as a single byte header
// strings have a max length and charCode of 255

// flatten all the things
// {name: 'data.color', pack() {}, unpack() {}, length() {}}
// defaults for string (max 255 length, ascii)
// number, store length in high nybble
// mouse needs to support negative and null

function pack(obj) {
    let out = [];

    // get command
    let commandIndex = commands.indexOf(obj.cmd);
    if (commandIndex == -1) {
        console.error('Packer: Command not found');
    }
    out.push(commandIndex);

    // enumerate remaining properties
    Object
        .keys(obj)
        .filter(key => key != 'cmd')
        .forEach(key => {
            // get value to compress
            let value = obj[key];

            // load schema
            let propIndex = properties.findIndex(d => d.name == key);
            let prop = properties[propIndex];

            // convert to bytes
            if (prop.string) {
                out.push(
                    propIndex,
                    value.length,
                    ...[...value].map(d => d.charCodeAt(0))
                );
            }

        });

    return Uint8Array.from(out);
}

function unpack(arr) {
    let out = {};

    // get command
    out.cmd = commands[arr[0]];
    if (!out.cmd) {
        console.error('Unpacker: Command not found');
    }

    // run through array, skipping command byte and skipping chunk header each iteration
    for (let i = 1; i < arr.length; i++) {

        // load schema from chunk header
        let prop = properties[arr[i]];

        // convert to object data
        if (prop.string) {
            let length = arr[i + 1];
            let str = Array.from(arr)
                .slice(i + 2, i + 2 + length)
                .map(d => String.fromCharCode(d))
                .join``
            i += length + 1;
            out[prop.name] = str;
        }

    }

    return out;
}

// --------------

let obj = {
    arr: Uint8ClampedArray.from(Array.from({length: 4*8}, (_,i) => 0|Math.random()*256)),
}
// BUFFERS~~~
// base64 numbers (MAX_SAFE_INT CHECK) (STRIP RGBA)
// Packs canvas image data for sending over the wire
// Input has to be a multiple of 4
// RGBA -> RGB -> char*1.5
// alpha is 255
// "1fffffffffffff"

// console.log(JSON.stringify(obj));

// obj.arr = cmp(obj.arr)

// console.log(JSON.stringify(obj));


// new ArrayBuffer(len)
// new Uint8ClampedArray(buf)

module.exports = {
    pack,
    unpack,
};
