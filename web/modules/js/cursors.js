import d3 from '#lib/d3';
import { event as d3event } from 'd3-selection';
import { ws, wsMessage } from './socket';
import { setStatus } from './statusbar';
import { scrollPos } from './scrollbars';
import { pack, unpack } from '#shared/crush';

let clients = [];

// events

wsMessage.on('message.cursors', ({message}) => {

    let { cmd, uid } = message;

    if (cmd == 'LIST') {
        clients = message.list;
        update();
    }

    else if (cmd == 'COLOR') {
        let { color } = message;
        d3.select(document.body)
            .style('cursor', 'url(\'data:image/svg+xml;utf8,'+encodeURIComponent(getCursorSVG(color))+'\'), auto');
    }

    else if (cmd == 'JOIN') {
        clients.push(message.config);
        update();
    }

    else if (cmd == 'PART') {
        let index = clients.findIndex((d) => d.uid == uid);
        clients.splice(index, 1);
        update();
    }

    else if (cmd == 'XY') {
        let { mouse } = message;
        let client = clients.find((d) => d.uid == uid);
        Object.assign(client, { mouse });
        update();
    }

});

// send local X/Y

let canvas = d3.select('canvas');

d3.select(document.body)
    .on('mousemove', () => {
        let [x, y] = d3.mouse(canvas.node());
        let { zoom } = scrollPos;
        ws.sendObj({cmd: 'XY', mouse: {x: x / zoom, y: y / zoom}});
    })
    .on('mouseleave', () => {
        ws.sendObj({cmd: 'XY', mouse: {x: null, y: null}});
    });

// display local X/Y

canvas
    .on('mousemove', function() {
        let [x, y] = d3.mouse(this);
        let { zoom } = scrollPos;
        setStatus('xy', {x: x / zoom, y: y / zoom});
    })
    .on('mouseleave', () => {
        setStatus('xy');
    });

// dom manipulation and data binding

let cursorGroup = d3.select('.canvasWrap');

function update() {
    let selection = cursorGroup
        .selectAll('.cursor')
        .data(clients, (d) => d.uid);

    let enter = selection.enter()
        .append('div')
        .style('position', 'absolute')
        .style('pointer-events', 'none')
        .style('z-index', 10)
        .classed('cursor', true)
        .html((d) => getCursorSVG(d.color))
        .merge(selection)
        .style('left', (d) => d.mouse.x + 'px')
        .style('top', (d) => d.mouse.y + 'px')
        .style('opacity', (d) => +(d.mouse.x != null && d.mouse.y != null));
    
    let exit = selection.exit()
        .remove();

    setStatus('connectedUsers', clients.length + 1);
}

// util

function getCursorSVG(color = '#FFF') {
    return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="12" height="25" viewBox="0 0 190 300"><path fill="'+color+'" d="M7.8-47.6H.4C0 10.4 0 68 0 125.4c0 30.7-.2 61 .3 91.8h31c.3-4.5.4-9 .4-13.4v-2H47c0-4.6.4-9.2 0-13.7l-.3-2.2 3 1c5 1 9 0 14 0v-15h15v3c0 10 1 19 1 29l14 1h2v2c0 10 0 19 1 29 5 1 9 1 14 1h2v15h31c1-4 1-9 0-13v-3h15c1-10 0-20 0-31h-16v-31h-15l1-2v-14h62v-31h-16v-16h-16v-15h-16v-15h-16v-15h-16v-16h-16v-15h-15v-15h-16v-15H48.3v-16H31.6v-16h-16v-2l-.3-14H7.6z"/><path d="M.3-47.3h15.3l.2 15.4H31v15.6H15.8c0 73 .2 145.5 0 218h15.7V186c5 0 10.2-.5 15.3.4 1 5 .5 10 .4 15H31.7c0 5 0 10-.4 15H.3c-.5-31-.2-61-.3-92 0-58 0-115 .4-173zm31 30.7c5 .3 10.4.3 15.5.3C47-11.3 47-6 47-1h15.4c0 5.4 0 10.5.3 15.7h16v15.5c6 0 11 0 16 .2 0 5 0 10 1 15h15v15h15l1 15h15v16h-16v-16h-16v-15h-16v-15h-15v-16h-16v-16h-15v-16h-16c-.4-6-.3-11-.3-16zm109 109c5 0 10.3 0 15.4.3 0 5 0 10.2.3 15.3 5 0 10.2 0 15.3.2v15.2c5.2.3 10.3.3 15.5.3.2 10.4 0 20.7 0 31-20.6.3-41.2.3-62 .4.2 5 .2 10 0 15.5H109v-31h62.3v-16h-15.6V108h-15.3c-.3-5.4-.3-10.6 0-16zm-78 62.3H78c.2 5.4.5 10.7-.3 16-4.8.4-9.7.3-14.5.3 0 5 0 10-.2 15-5.2 0-10.4.7-15.5-.3-1-5-.6-10.2-.5-15.4h15.5v-16zm15 16c5.5-.6 11-.4 16-.3v31H109v31c10.7 0 21-1 31.5 0 0 5 0 10-1 15h-31v-15h-15l-1-31c-5 0-10 0-16-1 0-11-2-21-1-31zm47.5-.3c5.2-.4 10.4 0 15.5 0v31h15v31.3c-5 0-10 .3-16 0-1-10.3 0-20.7-1-31-5-.2-11-.2-16-.2v-31z" fill="#1c1c1c"/></svg>';
}


