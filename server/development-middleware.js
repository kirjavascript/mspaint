let webpack = require('webpack');
let webpackConfig = require('../webpack.config.js')({dev:true});
let { Screen, Box, BigText, FileManager, Text } = require('blessed');

webpackConfig.output.path = '/';

let compiler = webpack(webpackConfig);

module.exports = function(app, wss, server) {

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
        reporter: reporter(reload, screen)
    }));


     // title //

    const title = new Text({
        left: 0,
        top: 0,
        content: `{yellow-fg}⚡️{/yellow-fg}mspaint`,
        parent: screen,
        tags: true,
        style: { bold: true },
    });

    screen.render();

}

// restart button
// broadcast noreload signal on node restart

function reporter(reload, screen) {


    let wpStatus = new Box({
        parent: screen,
        left: 0,
        bottom: 0,
        height: '100%-5',
        label: 'webpack',
        scrollable: true,
        alwaysScroll: true,
        mouse: true,
        tags: true,
        scrollbar: { },
        border: {
            type: 'line',
        },
        style: {
            border: {
                fg: '#FA0'
            },
            scrollbar: {
                bg: 'grey',
            },
        },
    });

    const log = (() => {
        let output;

        // create write steam
        let wStream = require('stream').Writable();
        wStream._write = function (chunk, enc, next) {
            output += chunk;
            next();
        };

        // create faux logger
        let logger = new console.Console(wStream, process.stderr);

        return (obj) => {
            output = '';
            logger.log(obj);
            wpStatus.setContent(output);
        };

    })();

    return ({ state, stats, options}) => {
        if(state) {

            const { hash, startTime, endTime, compilation } = stats;
            const { errors, assets, records, chunks, modules, entries } = compilation;

            const time = `{bold}${endTime - startTime}{/bold}ms`;

            // log({
            //     hash,
            //     time,
            //     errors: errors[0].error,
            // });

            wpStatus.setContent(errors[0].error)

            // TODO: warnings

            // let displayStats = (!options.quiet && options.stats !== false);
            // if(displayStats &&
                // !(stats.hasErrors() || stats.hasWarnings()) &&
                // options.noInfo)
                // displayStats = false;
            // if(displayStats) {
                // options.log(stats.toString(options.stats));
                // wpStatus.setContent(stats.toString(options.stats));
                // screen.render();
            // }
            if(!options.noInfo && !options.quiet) {
                // options.log('webpack: bundle is now VALID.');
                wpStatus.style.border.fg = '#06A';
                screen.render();
                reload();
            }
        } else {
            // options.log('webpack: bundle is now INVALID.');
            wpStatus.style.border.fg = '#FA0';
            screen.render();
        }
    }

}
