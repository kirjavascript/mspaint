import d3 from '#lib/d3';

// http://websocket.org/echo.html
// http://msgpack.org/index.html

export const ws = new WebSocket(`ws://${location.host}/`);

ws.sendObj = (obj) => ws.send(JSON.stringify(obj));

window.addEventListener('beforeunload', () => {
    ws.close();
});

ws.addEventListener('close', () => {
    if (__DEV__) {
        console.error('error: closed connection');
    }
    else {
        location.reload();
    }
});

ws.addEventListener('message', (e) => {

    let { cmd, uid, data } = JSON.parse(e.data);

    if (cmd == 'RELOAD') {
        location.reload();
    }

    else if (cmd == 'PING') {
        ws.sendObj({cmd: 'PONG'});
        console.log('ping: '+data);
    }
});

