// Custom format for crushing object data to send over the wire
//
// strings have a max length and charCode of 255
// arrays have a max length of 255

setTimeout(() => {

    let data = {
        cmd: 'CANVAS_FILL',
        // uid: Math.random().toString(36).slice(7),
        // color: '#' + Array.from({length: 3}, (_,i) => (0|Math.random()*256).toString(16)).map(d=>d.length<2?'0'+d:d).join``,
        // x: 123,
        // mouse: {
        //     x: 12,
        //     y: 17,
        // },

        "vdom":[
            {"uid":"9ocx7f7ds4i","x0":142,"y0":91,"x1":293,"y1":200,"type":"SELECTION","selecting":false}
        ],
        list: [
            {"uid":"7m9bhplj714i","color":"#7f7f7f","mouse":{"x":239,"y":375}},
            {"uid":"ire2myytlnmi","color":"#bcbd22","mouse":{"x":null,"y":14}},
            {"uid":"3m9bhplj714i"},
            {"uid":"7m9bhplj714i"},
        ],
        dx: 4,
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

    // console.log(unpack(packed))

});
//

let { pixelConvert, colorConvert } = require('./canvas/util');
let { USE_JSON } = require('./constants');

// lookup table for commands

let commands = [
    'RELOAD','JOIN','PART','LIST','COLOR','PING','PONG','XY',
    'CANVAS_FILL','CANVAS_PENCIL','CANVAS_BRUSH','CANVAS_ERASE',
    'DOM_VDOM','DOM_SELECT',
];

// schema definition

let properties = [
    {name: 'uid', string: 1},
    {name: 'event', string: 1},
    {name: 'x', number: 1},
    {name: 'y', number: 1},
    {name: 'dx', number: 1},
    {name: 'dy', number: 1},
    {name: 'size', number: 1},
    {name: 'shape', string: 1},
    {name: 'mouse', object: 1},
    {name: 'list', array: 1},
    {name: 'vdom', array: 1},
    {name: 'x0', number: 1},
    {name: 'y0', number: 1},
    {name: 'x1', number: 1},
    {name: 'y1', number: 1},
    {name: 'type', string: 1},
    {name: 'selecting', bool: 1},
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

// TODO: vdom, enum type

function pack(obj, typed = true) {

    if (USE_JSON) {
        return JSON.stringify(obj);
    }

    // get command (is stored as a single byte header)
    let commandIndex = commands.indexOf(obj.cmd);
    if (commandIndex == -1) {
        console.error('Packer: Command not found');
    }
    let out = packFragment(obj);

    // add header
    out.unshift(commandIndex);

    return typed ? Uint8Array.from(out) : out;
}

function packFragment(obj) {
    let out = [];

    // enumerate properties
    Object
        .keys(obj)
        .forEach(key => {
            if (key == 'cmd') {
                return;
            }

            // get value to compress
            let value = obj[key];

            // load schema
            let propIndex = propertyIndicies.indexOf(key);
            let prop = properties[propIndex] || {};

            // convert to bytes

            // strings & numbers
            if (prop.string || prop.number) {
                value = String(value);
                out.push(
                    propIndex,
                    value.length,
                    ...[...value].map(d => d.charCodeAt(0))
                );
            }
            // IEEE754 numbers
            else if (prop.stdNumber) {
                out.push(
                    propIndex,
                    ...(new Uint8Array(new Float64Array([value]).buffer))
                );
            }
            // subobjects
            else if (prop.object) {
                let fragment = packFragment(value);
                out.push(
                    propIndex,
                    fragment.length,
                    ...fragment
                );
            }
            // arrays
            else if (prop.array) {
                let fragments = value.map(f => {
                    let fragment = packFragment(f);
                    fragment.unshift(fragment.length);
                    return fragment;
                });
                out.push(
                    propIndex,
                    fragments.length,
                    ...[].concat(...fragments)
                );
            }
            // boolean
            else if (prop.bool) {
                out.push(
                    propIndex,
                    +value
                );
            }
            // custom
            else if (prop.pack) {
                out.push(
                    propIndex,
                    ...prop.pack(value)
                );
            }

        });

    return out;
}

function unpack(arr) {

    if (USE_JSON) {
        return JSON.parse(arr); // should be a string in this mode
    }

    let out = {};

    // get command
    out.cmd = commands[arr[0]];
    if (!out.cmd) {
        console.error('Unpacker: Command not found');
        return out;
    }

    unpackFragment(arr.slice(1), out);

    return out;
}

function unpackFragment(arr, out) {
    // run through array, skipping chunk header each iteration
    for (let i = 0; i < arr.length; i++) {

        // incrementing i again within this loop makes me feel extremely uneasy

        // load schema from chunk header
        let prop = properties[arr[i]];
        if (!prop) {
            console.error('Unpacker: Error unpacking data');
            return out;
        }

        // convert to object data

        if (prop.string || prop.number) {
            let strLength = arr[i + 1];
            let str = [...arr]
                .slice(i + 2, i + 2 + strLength)
                .map(d => String.fromCharCode(d))
                .join``
            i += strLength + 1; // plus length byte
            out[prop.name] = prop.number ? Number(str) : str;
        }
        else if (prop.stdNumber) {
            let num = new Float64Array([0]);
            let uint8 = new Uint8Array(num.buffer);
            for (let j = 0; j < 8; j++) {
                uint8[j] = arr[i + 1 + j];
            }
            i += 8;
            out[prop.name] = num[0];
        }
        else if (prop.object) {
            let objLength = arr[i + 1];
            out[prop.name] = {};
            unpackFragment(arr.subarray(i + 2, i + 2 + objLength), out[prop.name]);
            i+= objLength + 1;
        }
        else if (prop.array) {
            out[prop.name] = [];
            let qty = arr[i + 1];
            i += 2; // skip header
            for (let j = 0; j < qty; j++) {
                let size = arr[i];
                let obj = {};
                unpackFragment(arr.subarray(i + 1, i + 1 + size), obj);
                out[prop.name].push(obj);
                i += size + 1;
            }
            i -= 1; // adjust for autoinc
        }
        else if (prop.bool) {
            out[prop.name] = !!arr[i + 1];
            i++;
        }
        // everything else
        else if (prop.unpack) {
            let { length, value } = prop.unpack(i + 1, arr);
            i += length;
            out[prop.name] = value;
        }
    }
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
// new ArrayBuffer(len)
// new Uint8ClampedArray(buf)

module.exports = {
    pack,
    unpack,
};
