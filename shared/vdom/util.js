let { CANVAS } = require('../constants');

function getDOM() {
    return typeof __WEB__ != 'undefined'
        ? require('#js/workspace').getDOM()
        : void 0;
}

function normalizeObj(obj) {
    // normalize x0, y0, x1, y1
    if ('x0' in obj) {
        let { x0, y0, x1, y1 } = obj;
        obj.x = Math.min(x0, x1);
        obj.y = Math.min(y0, y1);
        obj.width = Math.max(1, Math.abs(x0 - x1) - 1);
        obj.height = Math.max(1, Math.abs(y0 - y1) - 1);

        // snap to bbox
        if (obj.x < 0) {
            obj.width += obj.x;
            obj.x = 0;
        }
        if (obj.y < 0) {
            obj.height += obj.y;
            obj.y = 0;
        }
        if (obj.x + obj.width + 2 >= CANVAS.width) {
            obj.width = CANVAS.width - obj.x - 2;
        }
        if (obj.y + obj.height + 2 >= CANVAS.height) {
            obj.height = CANVAS.height - obj.y - 2;
        }
    }
    return obj;
}

module.exports = {
    normalizeObj,
    getDOM,
};
