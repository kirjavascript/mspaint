let webpack = require('webpack');
let webpackConfig = require('../webpack.config.js')({dev:true});
let chokidar = require('chokidar');
let { Screen, Box, BigText, FileManager } = require('blessed');

webpackConfig.output.path = '/';

let compiler = webpack(webpackConfig);

module.exports = function(app, wss, server) {

    // create screen

    let screen = Screen({
        fastCSR: true,
        dockBorders: true,
    });

    screen.key('escape', () => {
        screen.destroy();
        server.close(() => {
            process.exit(0);
        });
    });

    // browser reload
    function reload() {
        // send reload signal to active clients
        wss.broadcastObj({cmd: 'RELOAD'});
    }

    // node process restart
    // function restart() {
    //     screen.destroy();
    //     server.close(() => {
    //         const { exit, execPath, argv, env, cwd } = process;
    //         require('child_process')
    //             .spawn(execPath, ['--harmony', ...argv.slice(1)], {
    //                 env,
    //                 cwd: cwd(),
    //                 detached: true,
    //                 stdio: 'inherit'
    //             }).unref();
    //         exit();
    //     });
    // }

    // check templates for changes

    chokidar
        .watch('web/templates/**/*', {ignored: /[\/\\]\./})
        .on('change', reload);

    // check server code and restart

    // chokidar
    //     .watch('server/**/*', {ignored: /[\/\\]\./})
    //     .on('change', restart);

    // load middleware

    app.use(require('webpack-dev-middleware')(compiler, {
        stats: {colors: true},
        reporter: reporter(reload, screen)
    }));

    screen.render();

}

// restart button
// ./index.js process runner & chokidar
// broadcast noreload signal on node restart

function reporter(reload, screen) {

     // title //

    new Box({
        left: 0,
        top: 0,
        content: `mspaint debugger`,
        parent: screen,
        style: {
            fg: 'white',
            bold: true,
            border: {
                fg: 'black',
                bg: 'white',

            },
        },
        // width: 'shrink',
        // height: 'shrink',
        // left: 'center',
    });

    let wpStatus = new Box({
        parent: screen,
        left: 0,
        bottom: 0,
        height: '100%-2',
        scrollable: true,
        alwaysScroll: true,
        label: 'webpack',
        border: {
            type: 'line',
        },
        style: {
            border: {
                fg: 'red'
            },
            scrollbar: {
                bg: 'blue',
                fg: 'red',
            },
        },
        mouse: true,
          scrollbar: {
            ch: ' ',
            // inverse: true
        },
        // draggable: true,
    });

    return ({ state, stats, options}) => {
        if(state) {
            let displayStats = (!options.quiet && options.stats !== false);
            if(displayStats &&
                !(stats.hasErrors() || stats.hasWarnings()) &&
                options.noInfo)
                displayStats = false;
            if(displayStats) {
                // options.log(stats.toString(options.stats));
                wpStatus.setContent(stats.toString(options.stats));
                screen.render();
            }
            if(!options.noInfo && !options.quiet) {
                // options.log('webpack: bundle is now VALID.');
                reload();
            }
        } else {
            // options.log('webpack: bundle is now INVALID.');


        }
    }

}
