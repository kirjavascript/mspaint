function normalizeObj(obj) {
    // normalize x0, y0, x1, y1
    if ('x0' in obj) {
        let { x0, y0, x1, y1 } = obj;
        obj.x = Math.min(x0, x1);
        obj.y = Math.min(y0, y1);
        obj.width = Math.abs(x0 - x1);
        obj.height = Math.abs(y0 - y1);
    }
}

module.exports = {
    normalizeObj,
};
