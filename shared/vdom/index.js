// forward PART event from socket.js/cursors.js
// normalize xydxdy

let { render } = require('./render');

let vdom = {};

function updateVDOM(obj) {

    let { cmd, dom, uid } = obj;

    let domCmd = cmd.substr(4);

    let key = uid || 'local';

    if (domCmd == 'SELECT') {
        let { event, x, y } = obj;

        if (event == 'start') {
            vdom[key] = {
                x0: x, y0: y,
                type: 'SELECTION_ACTIVE',
            };
        }
        else if (event == 'drag' || event == 'end') {
            vdom[key].x1 = x;
            vdom[key].y1 = y;
            if (event == 'end') {
                vdom[key].type = 'SELECTION';
            }
        }

        render(vdom, dom);
    }
}

module.exports = {
    updateVDOM,
};
