import WebSocket from 'ws';1;
import d3 from '#lib/d3';

let ws = new WebSocket(`ws://${location.origin}`);

ws.on('message', ({cmd, data}) => {

    if (cmd == 'reload') {
        location.reload();
    }
    else if (cmd == 'xy') {
        cursor.style('top', pageY + 'px')
            .style('left', pageX + 'px');
    }


});


document.addEventListener('mousemove', (e) => {

    let { pageX, pageY } = e;

    ws.send({cmd: 'xy', data: {pageX, pageY}});

});

let cursor = d3.select(document.body)
    .append('div')
    .style('width', '50px')
    .style('height', '50px')
    .style('background-color', 'black')
    .style('position', 'absolute');

