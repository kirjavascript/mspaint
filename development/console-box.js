const util = require('util');
const { Screen, Box, BigText, FileManager, Text, Button } = require('blessed');

module.exports = function (screen) {

    const container = new Box({
        parent: screen,
        left: 0,
        bottom: 0,
        height: '50%',
        label: 'console',
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
                fg: '#06A',
            },
            scrollbar: {
                bg: '#0AF',
            },
        },
    });

    const format = (obj) => {
        const str = util.inspect(obj, { depth: 1, colors: true })
            .replace(/(\[(.*?)\])/g, (a, b) => {
                return `{bold}{#0AF-fg}${a}{/}`;
            });
        return str;
    };

    console.log = (obj) => {
        container.setContent(format(obj));
        screen.render();
    };

    console.append = (obj) => {
        container.setContent(container.content + format(obj));
        screen.render();
    };

    console.prepend = (obj) => {
        container.setContent(format(obj) + container.content);
        screen.render();
    };
}
