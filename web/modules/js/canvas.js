import d3 from '#lib/d3';
import { event as d3event } from 'd3-selection';
import { ws } from './socket';
import { drawToContext, unwrapBuffer } from '#shared/canvas-tools';
import { CANVAS } from '#shared/constants';
import { drawColor } from './palette';

let {width, height} = CANVAS;
let canvas = d3.select('canvas').style('opacity', 0);
let ctx = canvas.node().getContext('2d');

// events

ws.addEventListener('message', (e) => {

    if (e.data instanceof ArrayBuffer) {
        let { cmd, typedArray } = unwrapBuffer(e.data);

        if (cmd == 'INIT') {
            let imageData = ctx.createImageData(width, height);
            imageData.data.set(typedArray);
            ctx.putImageData(imageData, 0, 0);
            canvas.style('opacity', 1);
        }

        return;
    }

    let { cmd, uid, data } = JSON.parse(e.data);

    if (cmd.indexOf('CANVAS_') != 0) return;

    drawToContext({ cmd, data, ctx });

});

// init canvas

canvas
    .attr('width', width)
    .attr('height', height);

canvas.call(d3.drag()
    .filter(() => d3event.button == 0 || d3event.button == 2)
    .on('start', dragstarted)
    .on('drag', dragging)
    .on('end', dragended));

// drawing

let buttons = ['primary', void 0, 'secondary'];
let mouseName = buttons[0];

function dragstarted(d) {
    mouseName = buttons[d3event.sourceEvent.button];
    dragging(d);
}

function dragging(d) {
    let { x, y, dx, dy } = d3event;

    let obj = {cmd: 'CANVAS_LINE', data: {
        x, y, dx, dy,
        color: drawColor[mouseName],
    }};

    ws.sendObj(obj);
    drawToContext({ctx, ...obj });

}

function dragended(d) {
}

