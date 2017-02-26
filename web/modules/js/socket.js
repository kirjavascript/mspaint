import d3 from '#lib/d3';

// http://websocket.org/echo.html
// http://msgpack.org/index.html

const ws = new WebSocket(`ws://${location.host}/`);

ws.sendObj = (obj) => ws.send(JSON.stringify(obj));

ws.addEventListener('message', (e) => {

    let { cmd, data } = JSON.parse(e.data);

    if (cmd == 'reload') {
        location.reload();
    }

    else if (cmd == 'xy') {
        let { pageX, pageY } = data;
        cursor.style('top', pageY + 'px')
            .style('left', pageX + 'px');
    }
    
});


document.addEventListener('mousemove', (e) => {

    let { pageX, pageY } = e;

    ws.sendObj({cmd: 'xy', data: {pageX, pageY}});

});

let cursor = d3.select(document.body)
    .append('div')
    .style('width', '50px')
    .style('height', '50px')
    .style('background-color', 'black')
    .style('position', 'absolute');