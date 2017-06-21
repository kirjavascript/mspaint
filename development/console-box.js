let { Screen, Box, BigText, FileManager, Text, Button } = require('blessed');

let conStr = require('./constr');

module.exports = function (screen) {

    let container = new Box({
        parent: screen,
        left: 0,
        bottom: 0,
        height: '50%',
        label: 'Console',
        scrollable: true,
        alwaysScroll: true,
        mouse: true,
        tags: true,
        scrollbar: { },
        padding: 1,
        border: {
            type: 'line',
        },
        style: {
            border: {
                fg: 'white',
            },
            scrollbar: {
                bg: '#0AF',
            },
        },
    });

    console.log = (...obj) => {
        container.setContent(conStr(...obj));
        screen.render();
    };

}
