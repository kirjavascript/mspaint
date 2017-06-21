let WebSocket = require('ws');
let { scaleOrdinal, schemeCategory10 } = require('d3-scale');
let { initCanvas, updateCanvas } = require('./canvas');
let { PING_INTERVAL } = require('../shared/constants');
let { pack, unpack } = require('../shared/crush');
let { updateWorkspace, getVDOM } = require('../shared/workspace');

let colorGenerator = (() => {
    let i = 0;
    let colorScale = scaleOrdinal(schemeCategory10);
    return () => colorScale(i++);
})();

let room = {};

function addClient(ws, wss) {

    // broadcast to all _other_ clients
    ws.broadcastObj = (data) => {
        data = pack(data);
        wss.clients.forEach((client) => {
            if (client != ws && client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    }

    ws.sendObj = (obj) =>
        (ws.readyState == WebSocket.OPEN) && ws.send(pack(obj));

    let uid, color = colorGenerator();
    do { uid = Math.random().toString(36).slice(6); }
    while (room[uid]);

    // send list of existing clients to ws

    ws.sendObj({cmd: 'LIST', list: Object.keys(room).map(key => {
        return room[key].config;
    })})

    // send copy of vdom
    ws.sendObj({cmd: 'DOM_VDOM', vdom: getVDOM()});

    // send mouse colour to client

    ws.sendObj({cmd: 'COLOR', color});

    // client object

    room[uid] = {
        ws,
        config: {
            uid, color, mouse: {/* x, y */}
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
        updateWorkspace({cmd: 'DOM_PART', uid});
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

        try {
            let message = unpack(__data);

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
                updateWorkspace(Object.assign({}, message));
                ws.broadcastObj(message);
            }
            else if (cmd.indexOf('DOM_') == 0) {
                let uidMessage = Object.assign({uid}, message);
                updateWorkspace(uidMessage);
                ws.broadcastObj(uidMessage);
            }

        } catch(e) { console.error(e); };

    });

}

function initSocket(app, wss) {

    // broadcast to _all_ clients
    wss.broadcast = (data) => {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    };

    wss.broadcastObj = (data) => {
        data = pack(data);
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

module.exports = {
    initSocket,
    room,
};
