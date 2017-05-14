import d3 from '#lib/d3';
import { setStatus } from './statusbar';
import debounce from '#lib/debounce';
import { PING_INTERVAL } from '#shared/constants';

// http://websocket.org/echo.html

export const ws = new WebSocket(`ws://${location.host}/`);

ws.sendObj = (obj) => ws.readyState == WebSocket.OPEN && ws.send(JSON.stringify(obj));
ws.binaryType = 'arraybuffer';

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

    if (e.data instanceof ArrayBuffer) return;

    let message = JSON.parse(e.data);

    let { cmd } = message;

    if (cmd == 'RELOAD') {
        location.reload();
    }

    else if (cmd == 'PING') {
        ws.sendObj({cmd: 'PONG'});
        setStatus('ping', message.ping);
        hasPinged();
    }
});

// check if the server is dead
const hasPinged = debounce(() => {
    setStatus('ping', `${PING_INTERVAL}+`);
}, PING_INTERVAL*2);
