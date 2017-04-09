import d3 from '#lib/d3';

let bar = d3.select('.statusbar');

let connectedUsers = bar.append('div').classed('cell', 1).append('span');
let ping = bar.append('div').classed('cell', 1).append('span');
let xy = bar.append('div').classed('cell', 1).append('span');

export function setStatus(type, data) {
    ({
        ping: (data) => ping.html(`Ping: ${data}`),
        connectedUsers: (data) => connectedUsers.html(`Connected Users: ${data}`),
        xy: (pos) => xy.html(pos ? `${pos.x}, ${pos.y}` : ''),
    }) [type](data);
}
