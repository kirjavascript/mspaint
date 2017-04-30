let { CANVAS } = require('../constants');
let { colorConvert, getPos, createWriter, matchesSelected } = require('./util');

// algorithm taken from http://www.williammalone.com/articles/html5-canvas-javascript-paint-bucket-tool/

module.exports = ({ ctx, x, y, color}) => {
    x = x|0;
    y = y|0;

    let colorData = colorConvert(color);
    let imgData = ctx.getImageData(0, 0, CANVAS.width, CANVAS.height);
    let checkMatch = matchesSelected(imgData.data, x, y);
    let setPixel = createWriter(imgData.data, colorData);

    let stack = [[x, y]];

    while (stack.length) {
        let reachLeft, reachRight;
        let [x, y] = stack.pop();
        let pos = getPos(x, y);

        while (y-- >= 0 && checkMatch(pos)) {
            pos -= CANVAS.width * 4;
        }

        pos += CANVAS.width * 4;
        ++y;
        reachLeft = false;
        reachRight = false;

        if (stack.length > 100000) return;

        while (y++ < CANVAS.height - 1 && checkMatch(pos)) {
            setPixel(pos);

            if (x > 0) {
                if (checkMatch(pos-4)) {
                    if (!reachLeft) {
                        stack.push([x - 1, y]);
                        reachLeft = true;
                    }
                }
                else if (reachLeft) {
                    reachLeft = false;
                }
            }

            if (x < CANVAS.width - 1) {
                if (checkMatch(pos+4)) {
                    if (!reachRight) {
                        stack.push([x + 1, y]);
                        reachRight = true;
                    }
                }
                else if (reachRight) {
                    reachRight = false;
                }
            }

            pos += CANVAS.width * 4;
        }

    }

    ctx.putImageData(imgData, 0, 0);
};

