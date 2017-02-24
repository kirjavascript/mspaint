let room = {};

function addClient(client, socket) {

    let uid = Math.random().toString(36).slice(2);

    room[uid] = {
        uid, ws: client,
        mouse: {
            pageX: null,
            pageY: null
        },
    };

    client.on('xy', (xy) => {

        Object.assign(room[uid].mouse, xy);

        broadcast(uid, (client) => {
            client.ws.emit('xy', xy);
        });
    })

}

function broadcast(uid, callback) {

    Object
        .keys(room)
        .map(client => room[client])
        .filter(client => client.uid != uid)
        .forEach(client => {
            callback(client);
        });

}

module.exports = (app, socket) => {

    // setInterval true/false ping

    socket.on('connection', (client) => {
        addClient(client, socket);
    });

};