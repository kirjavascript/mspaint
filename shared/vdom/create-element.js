let { colorConvert } = require('../canvas/util');

function createElement(config) {
    let element = {};

    observe(element, 'transparency', (obj, transparency) => {
        if (obj.imgData) {
            let { imgData, color, width, height } = obj;
            let [r, g, b] = colorConvert(color);
            for (let i = 0; i < width*height; i++) {
                let index = i * 4;
                if (
                    imgData.data[index + 0] === r &&
                    imgData.data[index + 1] === g &&
                    imgData.data[index + 2] === b
                ) {
                    imgData.data[index + 3] = transparency ? 0 : 0xFF;
                }
            }
            obj.dirty = true;
        }
    });

    return Object.assign(element, config);
}

function observe(obj, prop, reaction) {
    let state = void 0;
    Object.defineProperty(obj, prop, {
        enumerable: true,
        get: function () { return state; },
        set: function (value) {
            state = value;
            reaction(obj, value);
        },
    });
}

module.exports = {
    createElement,
};


