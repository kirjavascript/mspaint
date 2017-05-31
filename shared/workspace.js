let { drawToContext } = require('./canvas/');
let { updateVDOM, getVDOM } = require('./vdom/');

function updateWorkspace(obj) {
    if (!obj.cmd) return;

    if (obj.cmd.indexOf('CANVAS_') == 0) {
        drawToContext(obj);
    }
    else if (obj.cmd.indexOf('DOM_') == 0) {
        // uid* is added to message
        updateVDOM(obj);
    }
}

module.exports = {
    updateWorkspace,
    getVDOM,
};
