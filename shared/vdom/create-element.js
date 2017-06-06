let { getContext, colorConvert } = require('../canvas/util');
let { CANVAS } = require('../constants');

function createElement(config) {
    const ctx = getContext();

    // selection

    let element = Object.create({
        // imgData to canvas
        drop() {
            let { x, y, width, height, imgData, transparency } = element;
            // merge transparency
            if (transparency) {
                let below = ctx.getImageData(x, y, width, height);
                for (let i = 0; i < width*height; i++) {
                    let index = i * 4;
                    if (imgData.data[index + 3] == 0) {
                        imgData.data[index + 0] = below.data[index + 0];
                        imgData.data[index + 1] = below.data[index + 1];
                        imgData.data[index + 2] = below.data[index + 2];
                        imgData.data[index + 3] = 0xFF;
                    }
                }
            }
            ctx.putImageData(imgData, x, y, 0, 0, width, height);
        },
        // canvas to imgData
        yank() {
            let { x, y, width, height } = element;
            element.selecting = false;
            element.imgData = ctx.getImageData(x, y, width, height);
            // remove copied section
            let [r, g, b] = colorConvert(element.color);
            let copy = ctx.getImageData(x, y, width, height);
            for (let i = 0; i < width*height; i++) {
                let index = i * 4;
                copy.data[index + 0] = r;
                copy.data[index + 1] = g;
                copy.data[index + 2] = b;
                copy.data[index + 3] = 0xFF;
            }
            ctx.putImageData(copy, x, y, 0, 0, width, height);
        },
    });

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

    observe(element, 'bbox', (obj) => {
        let { x0, y0, x1, y1 } = obj.bbox;
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
    });

    return Object.assign(element, config);
}

// place - merge ctx
// transparency still broken

function observe(obj, prop, reaction) {
    let state = void 0;
    Object.defineProperty(obj, prop, {
        enumerable: true,
        get: () => state,
        set: (value) => {
            let prevState = state;
            state = value;
            reaction(obj, state, prevState);
        },
    });
}

module.exports = {
    createElement,
};
