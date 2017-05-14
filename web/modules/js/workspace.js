import d3 from '#lib/d3';
import { event as d3event } from 'd3-selection';
import { ws } from './socket';
import { updateWorkspace } from '#shared/workspace';
import { CANVAS } from '#shared/constants';
import { pixelConvert } from '#shared/canvas/util';
import { drawColor, setColor } from './palette';
import { setScroll, scrollPos } from './scrollbars';
import { drawTool } from './tools';

let {width, height} = CANVAS;
let canvas = d3.select('canvas').style('opacity', 0);
let ctx = canvas.node().getContext('2d');

// events

ws.addEventListener('message', (e) => {

    if (e.data instanceof ArrayBuffer) return;

    let message = JSON.parse(e.data);

    if (message.cmd.indexOf('CANVAS_') == 0) {
        updateWorkspace({ ctx, ...message });
    }

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
        .filter(dragFilter)
        .on('start', dragstarted)
        .on('drag', dragging)
        .on('end', dragended));

    setScroll();
}

function dragFilter() {
    return (
        d3event.button == 0 ||
        d3event.button == 2 ||
        d3event.type == 'touchstart'
    );
}

// drawing

let buttons = ['primary', void 0, 'secondary'];
let mouseName = buttons[0];

function dragstarted(d) {
    mouseName = buttons[d3event.sourceEvent.button] || 'primary';

    let { x, y } = getMotion();

    let { name, ...drawToolEtc } = drawTool;

    if (name == 'FILL') {
        let obj = {cmd: 'CANVAS_FILL',
            x, y, color: drawColor[mouseName],
        };

        ws.sendObj(obj);
        updateWorkspace({ctx, ...obj });
    }
    else {
        dragging(d);
    }
}

function dragging(d) {
    let { x, y, dx, dy } = getMotion();

    let { name, ...drawToolEtc } = drawTool;

    if (~['PENCIL','BRUSH'].indexOf(name)) {
        let obj = {cmd: 'CANVAS_' + name,
            x, y, dx, dy,
            color: drawColor[mouseName],
            ...drawToolEtc,
        };

        ws.sendObj(obj);
        updateWorkspace({ctx, ...obj });
    }
    else if (name == 'ERASE') {
        // I don't understand the logic here but this is what mspaint does, so...
        if (drawColor.match && mouseName == 'secondary') return;

        let obj = {cmd: 'CANVAS_ERASE',
            x, y, dx, dy,
            color: drawColor.secondary,
            ...drawToolEtc,
        };

        ws.sendObj(obj);
        updateWorkspace({ctx, ...obj });
    }
    else if (name == 'PICK') {
        let pixelColor, pixelData = Array.from(ctx.getImageData(x, y, 1, 1).data);
        if (pixelData[3] > 128) {
            pixelColor = pixelConvert(pixelData.splice(0, 3));
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
