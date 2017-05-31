let { pack, unpack } = require('./crush');
let { Suite } = require('benchmark');

let data = {
    cmd: 'CANVAS_FILL',
    // uid: Math.random().toString(36).slice(7),
    // color: '#' + Array.from({length: 3}, (_,i) => (0|Math.random()*256).toString(16)).map(d=>d.length<2?'0'+d:d).join``,
    // x: 123,
    // mouse: {
    //     x: 12,
    //     y: 17,
    // },

    // vdom:[
    //     {"uid":"9ocx7f7ds4i","x0":142,"y0":91,"x1":293,"y1":200,"type":"SELECTION","selecting":false}
    // ],
    // list: [
    //     {"uid":"7m9bhplj714i","color":"#7f7f7f","mouse":{"x":239,"y":375}},
    //     {"uid":"ire2myytlnmi","color":"#bcbd22","mouse":{"x":null,"y":14}},
    //     {"uid":"3m9bhplj714i"},
    //     {"uid":"7m9bhplj714i"},
    // ],
    //
    event: 'start',
    dx: null,
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

// benchmarks

let getData = {
    vdom:[
        {"uid":"9ocx7f7ds4i","x0":142,"y0":91,"x1":293,"y1":200,"type":"SELECTION","selecting":false}
    ],
    list: [
        {"uid":"7m9bhplj714i","color":"#7f7f7f","mouse":{"x":239,"y":375}},
        {"uid":"ire2myytlnmi","color":"#bcbd22","mouse":{"x":null,"y":14}},
        {"uid":"3m9bhplj714i"},
        {"uid":"7m9bhplj714i"},
    ],    cmd: 'RELOAD',
    mouse: {
        x: 12,
        y: 17,
    },
    dx: 4,
    uid: Math.random().toString(36).slice(7),
    color: '#' + Array.from({length: 3}, (_,i) => (0|Math.random()*256).toString(16)).map(d=>d.length<2?'0'+d:d).join``,
};

let strData = JSON.stringify(getData);
let pkdData = pack(getData);

new Suite()
    // .add('JSON.stringify', function() {
    //     JSON.stringify(getData)
    // })
    .add('pack', function() {
        pack(getData);
    })
    .on('cycle', function(event) {
        console.log(String(event.target));
    })
    // .on('complete', function() {
    //     console.log('Fastest is ' + this.filter('fastest').map('name'));
    // })
    .run({ 'async': true });

new Suite()
    // .add('JSON.parse', function() {
    //     JSON.parse(strData)
    // })
    .add('unpack', function() {
        unpack(pkdData);
    })
    .on('cycle', function(event) {
        console.log(String(event.target));
    })
    // .on('complete', function() {
    //     console.log('Fastest is ' + this.filter('fastest').map('name'));
    // })
    .run({ 'async': true });
