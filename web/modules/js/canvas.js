import d3 from '#lib/d3';
import { event as d3event } from 'd3-selection';
import { ws } from './socket';
import { drawToContext } from '#shared/workspace';
import { CANVAS } from '#shared/constants';
import { drawColor, setColor } from './palette';
import { setScroll, scrollPos } from './scrollbars';
import { drawTool } from './tools';

let {width, height} = CANVAS;
let canvas = d3.select('canvas').style('opacity', 0);
let ctx = canvas.node().getContext('2d');

// events

ws.addEventListener('message', (e) => {

    if (e.data instanceof ArrayBuffer) return;

    let { cmd, uid, data } = JSON.parse(e.data);

    if (cmd.indexOf('CANVAS_') != 0) return;

    drawToContext({ cmd, data, ctx });

});

// init canvas

canvas
    .attr('width', width)
    .attr('height', height);

// load initial canvas image

let preload = d3.select('.preload').node();

if (preload.complete) {
    initCanvas(preload);
}
else {
    preload.onload = () => initCanvas(preload);
}

function initCanvas(img) {
    ctx.drawImage(img, 0, 0, width, height);
    canvas.style('opacity', 1);

    // add events
    canvas.call(d3.drag()
        .filter(() => d3event.button == 0 || d3event.button == 2)
        .on('start', dragstarted)
        .on('drag', dragging)
        .on('end', dragended));

    setScroll();
}

// drawing

let buttons = ['primary', void 0, 'secondary'];
let mouseName = buttons[0];

function dragstarted(d) {
    mouseName = buttons[d3event.sourceEvent.button];

    let { x, y } = getMotion();

    if (drawTool.name == 'FILL') {
        let obj = {cmd: 'CANVAS_FILL', data: {
            x, y, color: drawColor[mouseName],
        }};

        ws.sendObj(obj);
        drawToContext({ctx, ...obj });
    }

    dragging(d);
}

function dragging(d) {
    let { x, y, dx, dy } = getMotion();

    let { name, ...drawToolEtc } = drawTool;

    if (~['PENCIL','BRUSH'].indexOf(name)) {
        let obj = {cmd: 'CANVAS_' + name, data: {
            x, y, dx, dy,
            color: drawColor[mouseName],
            ...drawToolEtc,
        }};

        ws.sendObj(obj);
        drawToContext({ctx, ...obj });
    }
    else if (name == 'ERASE') {
        if (drawColor.match && mouseName == 'secondary') return;

        let obj = {cmd: 'CANVAS_ERASE', data: {
            x, y, dx, dy,
            color: drawColor.secondary,
            ...drawToolEtc,
        }};

        ws.sendObj(obj);
        drawToContext({ctx, ...obj });
    }
    else if (name == 'PICK') {
        let pixelColor, pixelData = Array.from(ctx.getImageData(x, y, 1, 1).data);
        if (pixelData[3] > 128) {
            pixelColor = '#' + pixelData.splice(0, 3)
                .map((d) => {d = d.toString(16); return d.length>1?d:'0'+d;})
                .join``;
            setColor({[mouseName]: pixelColor});
            drawTool.pickColor = pixelColor;
        }
    }

}

function dragended(d) {
    let { x, y } = getMotion();
    let { name } = drawTool;

    if (name == 'ZOOM') {
        if (scrollPos.zoom != 1) {
            setScroll({zoom: 1});
        }
        else {
            setScroll({zoom: 4, x, y});
        }
    }

    drawTool.onEnd && drawTool.onEnd();
}

function getMotion() {
    let { x, y, dx, dy } = d3event;
    let { zoom } = scrollPos;
    return {
        x: (x / zoom),
        y: (y / zoom),
        dx: (dx / zoom),
        dy: (dy / zoom),
    };
}
