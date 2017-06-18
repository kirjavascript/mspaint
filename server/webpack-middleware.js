let webpack = require('webpack');
let webpackConfig = require('../webpack.config.js')({dev:true});

webpackConfig.output.path = '/';

let compiler = webpack(webpackConfig);

function middlepack(app, wss) {

    // init socket info

    function reload() {
        // send reload signal to active clients
        wss.broadcastObj({cmd: 'RELOAD'});
    }

    // check templates for changes

    require('chokidar').watch('web/templates/**/*', {ignored: /[\/\\]\./})
        .on('change', reload);

    // load middleware

    app.use(require('webpack-dev-middleware')(compiler, {
        stats: {colors: true},
        reporter: reporter(reload)
    }));

}

let { Screen, Box, BigText, FileManager } = require('blessed');

// check node files for restart
// restart button
// drop nodemon
// broadcast noreload signal on node restart

function reporter(reload) {

    let screen = Screen({
        fastCSR: true,
        dockBorders: true,
    });

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
        height: '50%',
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
        draggable: true,
    });

    screen.key('escape', () => {
        process.exit();
    });

    screen.render();

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

module.exports = middlepack;
