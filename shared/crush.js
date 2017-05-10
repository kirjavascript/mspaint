// Custom format for crushing object data to send over the wire

setTimeout(() => {

    let data = {
        cmd: 'CANVAS_FILL',
        uid: Math.random().toString(36).slice(7),
        color: '#' + Array.from({length: 3}, (_,i) => (0|Math.random()*256).toString(16)).map(d=>d.length<2?'0'+d:d).join``,
        x: 31337,
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
    {name: 'x', number: 1},
    {
        name: 'color',
        pack: colorConvert,
        unpack(index, arr) {
            return {
                length: 3,
                value: pixelConvert(arr.subarray(index, index + 3)),
            };
        },
    },
];

// create index lookup to avoid using .findIndex

let propertyIndicies = properties.map(d => d.name);

// command is stored as a single byte header
// strings have a max length and charCode of 255

// number, store length in high nybble, sign in low nybble (!)
// IEEE float?
// new Uint8Array(new Float64Array([num]).buffer)
// endianness check; new Uint8Array(Uint16Array.of(1).buffer)
// detect endianness, modify based on it
// mouse needs to support negative and null
// x, y, dx, dy, size, shape, list,

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
            let propIndex = propertyIndicies.indexOf(key);
            let prop = properties[propIndex];

            // convert to bytes
            
            // strings
            if (prop.string) {
                out.push(
                    propIndex,
                    value.length,
                    ...[...value].map(d => d.charCodeAt(0))
                );
            }
            else if (prop.pack) {
                out.push(
                    propIndex,
                    ...prop.pack(value)
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
        return out;
    }

    // run through array, skipping command byte and skipping chunk header each iteration
    for (let i = 1; i < arr.length; i++) {

        // incrementing i again within this loop makes me feel extremely uneasy

        // load schema from chunk header
        let prop = properties[arr[i]];
        if (!prop) {
            console.error('Unpacker: Error unpacking data');
            return out;
        }

        // convert to object data

        // strings
        if (prop.string) {
            let strLength = arr[i + 1];
            let str = [...arr]
                .slice(i + 2, i + 2 + strLength)
                .map(d => String.fromCharCode(d))
                .join``
            i += strLength + 1; // plus length byte
            out[prop.name] = str;
        }
        // everything else
        else if (prop.unpack) {
            let { length, value } = prop.unpack(i + 1, arr);
            i += length;
            out[prop.name] = value;
        }

    }

    return out;
}

// --------------

let obj = {
    arr: Uint8ClampedArray.from(Array.from({length: 4*8}, (_,i) => 0|Math.random()*256)),
}
// BUFFERS~~~
// test browser compat after this
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