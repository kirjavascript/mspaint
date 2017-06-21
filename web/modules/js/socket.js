import d3 from '#lib/d3';
import { setStatus } from '#ui/statusbar';
import debounce from '#lib/debounce';
import { PING_INTERVAL, PORT } from '#shared/constants';
import { pack, unpack } from '#shared/crush';

// http://websocket.org/echo.html

export const ws = new WebSocket(`ws://${location.hostname}:${PORT}/`);
export const wsMessage = d3.dispatch('message');

ws.sendObj = (obj) => ws.readyState == WebSocket.OPEN && ws.send(pack(obj));
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

    let message = unpack(e.data);

    wsMessage.call('message', this, { message });

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
