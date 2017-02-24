
let webpack = require('webpack');
let webpackConfig = require('../webpack.config.js')({dev:true});

webpackConfig.output.path = '/';

let compiler = webpack(webpackConfig);

function middlepack(app, socket) {

    // init socket info

    function reload() {
        // send reload signal to active clients
        Object
            .keys(socket.sockets.sockets)
            .map(d => socket.sockets.sockets[d])
            .filter(client => client.connected)
            .forEach(client => {
                client.emit('reload');
            })
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

// alternative to .waitUntilValid();

function reporter(reload) {

    return ({ state, stats, options}) => {
        if(state) {
            let displayStats = (!options.quiet && options.stats !== false);
            if(displayStats &&
                !(stats.hasErrors() || stats.hasWarnings()) &&
                options.noInfo)
                displayStats = false;
            if(displayStats) {
                options.log(stats.toString(options.stats));
            }
            if(!options.noInfo && !options.quiet) {
                options.log('webpack: bundle is now VALID.');
                reload();
            }
        } else {
            options.log('webpack: bundle is now INVALID.');
        }
    }

}

module.exports = middlepack;
