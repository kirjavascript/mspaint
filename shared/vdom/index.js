let { render } = require('./render');
let { getContext } = require('../canvas/util');
let { normalizeObj } = require('./util');

let vdom = {};

function updateVDOM(obj) {

    let { cmd, uid } = obj;

    let domCmd = cmd.substr(4);

    let target = uid || 'local';

    if (domCmd == 'VDOM') {
        vdom = parseVDOM(obj.vdom);
        render(vdom);
    }
    else if (domCmd == 'SELECT') {
        let { event, x, y } = obj;

        if (event == 'start') {
            vdom[target] = {
                x0: x, y0: y, x1: x, y1: y,
                type: 'SELECTION',
                selecting: true,
            };
            normalizeObj(vdom[target]);
        }
        else if (event == 'drag' || event == 'end') {
            vdom[target].x1 = x;
            vdom[target].y1 = y;
            normalizeObj(vdom[target]);
            if (event == 'end') {
                const ctx = getContext();
                let { x, y, width, height } = normalizeObj(vdom[target]);

                vdom[target].selecting = false;
                vdom[target].imgData = ctx.getImageData(x, y, width, height);

                let copy = ctx.getImageData(x, y, width, height);
                for (let i = 0; i < width*height*4; i++) {
                    copy.data[i] = 0xFF;
                }
                ctx.putImageData(copy, x, y, 0, 0, width, height);
            }
        }

        render(vdom);
    }
    else if (domCmd == 'MOVE') {
        let { dx, dy } = obj;
        vdom[target].x += dx;
        vdom[target].y += dy;
        render(vdom);
    }
    // the following commands are redirected from elsewhere,
    // and are not part of the communication schema
    else if (domCmd == 'PART') {
        delete vdom[target];
        render(vdom);
    }
}

// for converting VDOM to/from wire data

// run once clientside when receiving initial VDOM
function parseVDOM(vdomWireData) {
    let vdom = {};
    vdomWireData.forEach((d) => {
        vdom[d.uid] = d;
        delete vdom[d.uid].uid;
    });
    return vdom;
}

// run serverside to generate VDOM for new clients
function getVDOM(uid) {
    return uid ? vdom[uid] : Object.keys(vdom).map((key) => {
        return Object.assign({ uid: key }, vdom[key]);
    });
}

module.exports = {
    updateVDOM,
    getVDOM,
};
