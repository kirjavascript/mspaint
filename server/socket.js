let WebSocket = require('ws');

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

    let uid = Math.random().toString(36).slice(2);

    room[uid] = {
        uid, ws,
        mouse: {
            pageX: null,
            pageY: null
        },
    };

    ws.on('message', (__data, {binary}) => {

        // JSON
        if (!binary) {
            try {
                let { cmd, data } = JSON.parse(__data);

                if (cmd == 'xy') {
                    Object.assign(room[uid].mouse, data);

                    ws.broadcastObj({
                        cmd: 'xy', data
                    });
                }

            } catch(e) { console.error(e); };
        }
        // TypedArray
        else {

        }
        
    })

}

module.exports = (app, wss) => {

    // setInterval true/false ping

    wss.on('connection', (ws) => {
        addClient(ws, wss);
    });

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

};