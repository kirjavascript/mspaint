let { render } = require('./render');

let vdom = {};

function updateVDOM(obj) {

    let { cmd, dom, uid } = obj;

    let domCmd = cmd.substr(4);

    let target = uid || 'local';

    if (domCmd == 'VDOM') {
        vdom = obj.vdom;
        render(vdom, dom);
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

        render(vdom, dom);
    }
    // the following commands are redirected from elsewhere,
    // and are not part of the communication schema
    else if (domCmd == 'PART') {
        delete vdom[target];
        render(vdom, dom);
    }
}

function getVDOM() {
    return vdom;
}

module.exports = {
    updateVDOM,
    getVDOM,
};
