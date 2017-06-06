// Custom format for crushing object data to send over the wire
//
// strings have a max length and charCode of 255
// arrays have a max length of 255
// properties with the value undefined will not be sent

let { pixelConvert, colorConvert } = require('./canvas/util');
let { USE_JSON } = require('./constants');

// lookup table for commands

let commands = [
    'RELOAD','JOIN','PART','LIST','COLOR','PING','PONG','XY',
    'CANVAS_FILL','CANVAS_PENCIL','CANVAS_BRUSH','CANVAS_ERASE',
    'DOM_VDOM','DOM_SELECT','DOM_MOVE','DOM_ASSIGN',
];

// schema definition

let properties = [
    {name: 'uid', string: 1},
    {name: 'event', enum: ['start', 'drag', 'end', 'drop']},
    {name: 'ping', number: 1},
    {name: 'dx', number: 1},
    {name: 'x', number: 1},
    {name: 'y', number: 1},
    {name: 'dx', number: 1},
    {name: 'dy', number: 1},
    {name: 'size', number: 1},
    {name: 'shape', string: 1},
    {name: 'transparency', bool: 1},
    {name: 'mouse', object: 1},
    {name: 'list', array: 1},
    {name: 'vdom', array: 1},
    {name: 'x0', number: 1},
    {name: 'y0', number: 1},
    {name: 'x1', number: 1},
    {name: 'y1', number: 1},
    {name: 'width', number: 1},
    {name: 'height', number: 1},
    {name: 'type', string: 1},      // TODO: should be an enum
    {name: 'selecting', bool: 1},
    {name: 'dirty', bool: 1},
    {name: 'config', object: 1},
    {name: 'bbox', object: 1},
    {name: 'properties', object: 1},
    {
        name: 'imgData',
        pack(obj) { return []; },
        unpack(index, arr) {
            return {
                length: 0,
                value: 'USE_PNG',
            };
        },
    },
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

let propertyIndicies = properties.map((d) => d.name);

function pack(obj) {

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

    return Uint8Array.from(out);
}

function packFragment(obj) {
    let out = [];

    // enumerate properties
    Object
        .keys(obj)
        .forEach((key) => {
            // get value to compress
            let value = obj[key];

            if (key === 'cmd' || value === undefined) {
                return;
            }

            // load schema
            let propIndex = propertyIndicies.indexOf(key);
            let prop = properties[propIndex] || {};

            // convert to bytes

            // strings & numbers
            if (prop.string || prop.number) {
                if (prop.number) {
                    if (typeof value === 'number' && value % 1 !== 0) {
                        value = value.toFixed(4);
                    }
                    value = String(value);
                }
                out.push(
                    propIndex,
                    value.length,
                    ...[...value].map((d) => d.charCodeAt(0))
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
                let fragments = value.map((f) => {
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
            // enum
            else if (prop.enum) {
                out.push(
                    propIndex,
                    prop.enum.indexOf(value)
                );
            }
            // custom
            else if (prop.pack) {
                out.push(
                    propIndex,
                    ...prop.pack(value)
                );
            }
            else {
                console.error(`Packer: ${key} not in schema`);
            }

        });

    return out;
}

function unpack(arr) {

    if (USE_JSON) {
        return JSON.parse(arr); // should be a string in this mode
    }

    if (arr instanceof ArrayBuffer) {
        arr = new Uint8Array(arr, 0, arr.byteLength);
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
                .map((d) => String.fromCharCode(d))
                .join``;
            i += strLength + 1; // plus length byte
            // number also supports null, for historic reasons
            if (prop.number && str == 'null') {
                out[prop.name] = null;
            }
            else {
                out[prop.name] = prop.number ? Number(str) : str;
            }
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
        else if (prop.enum) {
            out[prop.name] = prop.enum[arr[i + 1]];
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

module.exports = {
    pack,
    unpack,
};
