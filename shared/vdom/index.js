let { getContext, colorConvert } = require('../canvas/util');
let { normalizeObj } = require('./util');
let { render, vdomEmitter } = require('./render');
let { createElement } = require('./create-element');

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
            vdom[target] = createElement({
                x0: x, y0: y, x1: x, y1: y,
                type: 'SELECTION',
                selecting: true,
                color: obj.color,
                transparency: obj.transparency,
            });
            normalizeObj(vdom[target]);
        }
        else if (event == 'drag' || event == 'end') {
            // skip deleted selections
            if (!vdom[target]) return;

            vdom[target].x1 = x;
            vdom[target].y1 = y;
            normalizeObj(vdom[target]);
            if (event == 'end') {
                const ctx = getContext();
                let { x, y, width, height, transparency } = normalizeObj(vdom[target]);

                vdom[target].selecting = false;
                vdom[target].imgData = ctx.getImageData(x, y, width, height);
                // remove copied section
                let [r, g, b] = colorConvert(vdom[target].color);
                let copy = ctx.getImageData(x, y, width, height);
                for (let i = 0; i < width*height; i++) {
                    let index = i * 4;
                    copy.data[index + 0] = r;
                    copy.data[index + 1] = g;
                    copy.data[index + 2] = b;
                    copy.data[index + 3] = 0xFF;
                }
                ctx.putImageData(copy, x, y, 0, 0, width, height);
            }
        }
        else if (event == 'drop') {
            const ctx = getContext();
            let { x, y, width, height, imgData } = vdom[target];
            ctx.putImageData(imgData, x, y, 0, 0, width, height);
            delete vdom[target];
        }

        render(vdom);
    }
    else if (domCmd == 'ASSIGN') {
        if (vdom[target]) {
            Object.assign(vdom[target], obj.properties);
            render(vdom);
        }
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
        vdom[d.uid] = createElement(d);
        delete vdom[d.uid].uid;
    });
    return vdom;
}

// run serverside to generate VDOM for new clients
function getVDOM(uid) {
    return uid ? vdom[uid] || {} : Object.keys(vdom).map((key) => {
        return Object.assign({ uid: key }, vdom[key]);
    });
}

module.exports = {
    updateVDOM,
    getVDOM,
    vdomEmitter,
};
