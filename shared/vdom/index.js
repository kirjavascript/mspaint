let { render } = require('./render');

let vdom = {};

function updateVDOM(obj) {

    let { cmd, uid } = obj;

    let domCmd = cmd.substr(4);

    let target = uid || 'local';

    if (domCmd == 'VDOM') {
        Object.assign(vdom, parseVDOM(obj.vdom));
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
        }
        else if (event == 'drag' || event == 'end') {
            vdom[target].x1 = x;
            vdom[target].y1 = y;
            if (event == 'end') {
                vdom[target].type = 'SELECTION';
                vdom[target].selecting = false;
            }
        }

        render(vdom);
    }
    // the following commands are redirected from elsewhere,
    // and are not part of the communication schema
    else if (domCmd == 'PART') {
        delete vdom[target];
        render(vdom);
    }
}

// for converting to/from wire data

function parseVDOM(vdomWireData) {
    let vdom = {};
    vdomWireData.forEach((d) => {
        vdom[d.uid] = d;
        delete vdom[d.uid].uid;
    });
    return vdom;
}

function getVDOM() {
    return Object.keys(vdom).map((key) => {
        return Object.assign({ uid: key }, vdom[key]);
    });
}

module.exports = {
    updateVDOM,
    getVDOM,
};
