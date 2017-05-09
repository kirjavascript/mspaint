let WebSocket = require('ws');
let { scaleOrdinal, schemeCategory10 } = require('d3-scale');
let { initCanvas, updateCanvas, readCanvas } = require('./canvas');
let { PING_INTERVAL } = require('../shared/constants');

let colorGenerator = (() => {
    let i = 0;
    let colorScale = scaleOrdinal(schemeCategory10);
    return () => colorScale(i++);
})();

let room = {};

function addClient(ws, wss) {

    // broadcast to all _other_ clients
    ws.broadcastObj = (data) => {
        data = JSON.stringify(data);
        wss.clients.forEach((client) => {
            if (client != ws && client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    }

    ws.sendObj = (obj) =>
        (ws.readyState == WebSocket.OPEN) && ws.send(JSON.stringify(obj));

    let uid, color = colorGenerator();
    do { uid = Math.random().toString(36).slice(7); }
    while (room[uid]);

    // send list of existing to ws

    ws.sendObj({cmd: 'LIST', list: Object.keys(room).map(key => {
        return room[key].config;
    })})

    // send mouse colour to client

    ws.sendObj({cmd: 'COLOR', color});

    // client object

    room[uid] = {
        ws,
        config: {
            uid, color, name: '', mouse: {/* x, y */}
        },
        pong: Date.now(),
    };

    // broadcast join to others

    ws.broadcastObj({cmd: 'JOIN', config: room[uid].config, uid});

    // keep alive / ping

    let pingFunc = setInterval(() => {
        let ping = Math.abs(- room[uid].pong + Date.now() - PING_INTERVAL);
        if (ping <= PING_INTERVAL) {
            ws.sendObj({cmd: 'PING', ping});
        }
        else if (ping > PING_INTERVAL*2) {
            room[uid].remove();
        }
    }, PING_INTERVAL);

    // remove

    room[uid].remove = () => {
        ws.broadcastObj({cmd: 'PART', uid});
        clearInterval(pingFunc);
        ws.close();
        delete room[uid];
    };

    ws.on('close', () => {
        room[uid] && room[uid].remove();
    });

    // messages

    ws.on('message', (__data, {binary}) => {
        if (!room[uid]) return;

        // JSON
        if (!binary) {
            try {
                let message = JSON.parse(__data);

                let { cmd } = message;

                if (cmd == 'PONG') {
                    room[uid].pong = Date.now();
                }
                else if (cmd == 'XY') {
                    let { mouse } = message;

                    Object.assign(room[uid].config.mouse, mouse);

                    ws.broadcastObj({
                        cmd: 'XY', mouse, uid
                    });
                }
                else if (cmd.indexOf('CANVAS_') == 0) {
                    // replace with updateWorkspace() ?
                    updateCanvas({ message, uid, ws });
                }

            } catch(e) { console.error(e); };
        }
        // TypedArray
        else {

        }

    });

}

module.exports = (app, wss) => {

    // broadcast to _all_ clients
    wss.broadcast = (data) => {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    };

    wss.broadcastObj = (data) => {
        data = JSON.stringify(data);
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    };

    wss.on('connection', (ws) => {
        addClient(ws, wss);
    });

    initCanvas(wss, room);

};
