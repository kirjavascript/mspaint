import io from 'socket.io-client';
import d3 from '#lib/d3';

let socket = io.connect(location.origin);
let uid;

socket.on('reload', () => {
    location.reload();
});




document.addEventListener('mousemove', (e) => {

    let { pageX, pageY } = e;

    socket.emit('xy', {pageX, pageY});

});


document.addEventListener('touchmove', (e) => {

    let { pageX, pageY } = e;

    socket.emit('xy', {pageX, pageY});

});

let cursor = d3.select(document.body)
    .append('div')
    .style('width', '50px')
    .style('height', '50px')
    .style('background-color', 'black')
    .style('position', 'absolute');


socket.on('xy', ({pageX, pageY}) => {
    cursor.style('top', pageY + 'px')
        .style('left', pageX + 'px');

});

