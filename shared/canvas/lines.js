function drawRectLine({ color, size, x, y, dx, dy, ctx }) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(x - dx, y - dy);
    let x1,y1;
    if (dx > 0) {
        x1 = x - dx, y1 = y - dy;
    }
    else {
        x1 = x, y1 = y;
        x = x - dx, y = y - dy;
    }
    if ((dy < 0 && dx > 0) || (dy > 0 && dx <= 0)) {
        ctx.lineTo(x1-size,y1-size); // <^
        ctx.lineTo(x-size,y-size); // <^
        ctx.lineTo(x+size,y-size); // ^>
        ctx.lineTo(x+size,y+size); // v>
        ctx.lineTo(x1+size,y1+size); // v>
        ctx.lineTo(x1-size,y1+size); // <v
        ctx.lineTo(x1-size,y1-size); // <^
    }
    else {
        ctx.lineTo(x1+size,y1-size); // ^>
        ctx.lineTo(x+size,y-size); // ^>
        ctx.lineTo(x+size,y+size); // v>
        ctx.lineTo(x-size,y+size); // <v
        ctx.lineTo(x1-size,y1+size); // <v
        ctx.lineTo(x1-size,y1-size); // <^
        ctx.lineTo(x1+size,y1-size); // ^>
    }

    ctx.closePath();
    ctx.fill();
}

module.exports = {
    drawRectLine,
};
