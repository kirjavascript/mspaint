let WebSocket = require('ws');

let room = {};

function addClient(ws, wss) {

    // broadcast to all _other_ clients
    ws.broadcast = (data) => {
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

    client.on('xy', (xy) => {

        Object.assign(room[uid].mouse, xy);

        ws.broadcast({
            type: 'xy',
            data: xy 
        });
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

};