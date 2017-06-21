let webpack = require('webpack');
let webpackConfig = require('../webpack.config.js')({dev:true});
let { Screen, Box, BigText, FileManager, Text, Button } = require('blessed');
let webpackBox = require('./webpack-box');
let consoleBox = require('./console-box');

// restart button VDOM, room
// broadcast noreload signal on node restart
// DEFAULT_SCROLL_OPTIONS
// patch console.log to a window

module.exports = function(app, wss, server) {

    webpackConfig.output.path = '/';

    let compiler = webpack(webpackConfig);

    // create screen

    let screen = Screen({
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

    // load middleware

    app.use(require('webpack-dev-middleware')(compiler, {
        stats: {colors: true},
        reporter: webpackBox(screen, reload),
    }));

    // title //

    const title = new Text({
        left: 0,
        top: 0,
        content: `mspaint`,
        content: require('./ascii-logo')(),
        parent: screen,
        tags: true,
    });

    consoleBox(screen);

    screen.render();

}
