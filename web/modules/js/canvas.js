import d3 from '#lib/d3';
import { event as d3event } from 'd3-selection';
import { ws } from './socket';
import { drawToContext, unwrapBuffer } from '#shared/canvas-tools';

let [width, height] = [1280,800];
let canvas = d3.select('canvas').style('opacity', 0);
let ctx = canvas.node().getContext('2d');
let data = [];

// events

ws.addEventListener('message', (e) => {

    if (e.data instanceof ArrayBuffer) {
        let { cmd, typedArray } = unwrapBuffer(e.data);

        if (cmd == 'INIT') {
            let imageData = ctx.createImageData(width, height);
            imageData.data.set(typedArray);
            ctx.putImageData(imageData, 0, 0);
            canvas.transition()
                .duration(500)
                .style('opacity', 1);
        }

        return;
    }

    let { cmd, uid, data } = JSON.parse(e.data);

    if (cmd.indexOf('CANVAS_') != 0) return;

    drawToContext({ cmd, data, ctx });

});

// init canvas

canvas
    .datum(data)
    .attr('width', width)
    .attr('height', height);

canvas.call(d3.drag()
    .on('start', dragstarted)
    .on('drag', dragging)
    .on('end', dragended));

// drawing

function dragstarted(d) {
    dragging(d);
}

function dragging(d) {
    let obj = {cmd: 'CANVAS_LINE', data: d3event};

    ws.sendObj(obj);
    drawToContext({ctx, ...obj });

    //     let radius = 5;
    //     ctx.beginPath();
    //     ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    //     ctx.fillStyle = 'green';
    //     ctx.fill();
}

function dragended(d) {
}

