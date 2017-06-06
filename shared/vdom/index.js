let { getContext, colorConvert } = require('../canvas/util');
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
                type: 'SELECTION',
                selecting: true,
                color: obj.color,
                transparency: obj.transparency,
                bbox: { x0: x, y0: y, x1: x, y1: y, },
            });
        }
        else if (event == 'drag' || event == 'end') {
            // skip deleted selections
            if (!vdom[target]) return;

            vdom[target].bbox = {
                ...vdom[target].bbox,
                x1: x,
                y1: y,
            };

            if (event == 'end') {
                vdom[target].yank();
            }
        }
        else if (event == 'drop') {
            vdom[target].drop();
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
