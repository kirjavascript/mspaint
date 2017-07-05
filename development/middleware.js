const webpack = require('webpack');
const webpackConfig = require('../webpack.config.js')({dev:true});

const { Screen, Box, BigText, FileManager, Text, Button, Listbar } = require('blessed');
const webpackBox = require('./webpack-box');
const consoleBox = require('./console-box');

// inject console earlier

module.exports = function(app, wss, server) {

    webpackConfig.output.path = '/';

    const compiler = webpack(webpackConfig);

    // create screen

    const screen = Screen({
        fastCSR: true,
        dockBorders: true,
    });

    function rip() {
        screen.destroy();
        server.close(() => {
            process.exit(0);
        });
    }

    screen.key(['escape', 'q', 'C-c'], rip);

    // browser reload
    function reload() {
        // send reload signal to active clients
        wss.broadcastObj({cmd: 'RELOAD'});
    }

    // check templates for changes

    require('chokidar')
        .watch('web/templates/**/*', {ignored: /[\/\\]\./})
        .on('change', reload);

    // load webpack middleware

    app.use(require('webpack-dev-middleware')(compiler, {
        stats: {colors: true},
        reporter: webpackBox(screen, reload),
    }));

    // draw UI
    consoleBox(screen);

    const title = new Text({
        left: 0,
        top: 0,
        content: `mspaint`,
        content: require('./ascii-logo')(),
        parent: screen,
        tags: true,
    });

    screen.render();

}
