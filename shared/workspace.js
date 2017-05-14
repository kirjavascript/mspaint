let { drawToContext } = require('./canvas/');

function updateWorkspace(obj) {
    if (obj.cmd.indexOf('CANVAS_') == 0) {
        drawToContext(obj);
    }
}
module.exports = {
    updateWorkspace,
};
