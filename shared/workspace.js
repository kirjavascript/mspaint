let { drawToContext } = require('./canvas/');
let { updateVDOM } = require('./vdom/');

function updateWorkspace(obj) {
    if (obj.cmd.indexOf('CANVAS_') == 0) {
        // ctx is added to message
        drawToContext(obj);
    }
    else if (obj.cmd.indexOf('DOM_') == 0) {
        // dom, uid* is added to message
        updateVDOM(obj);
    }
}

module.exports = {
    updateWorkspace,
};
