let io = require('socket.io');
let webpack = require('webpack');
let webpackConfig = require('../webpack.config.js')({dev:true});

webpackConfig.output.path = '/';

let compiler = webpack(webpackConfig);

function middlepack(app, server) {

    // init socket info

    let socket = io.listen(server);

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
        .on('all', reload);

    // load middleware

    app.use(require('webpack-dev-middleware')(compiler, {
        stats: {colors: true},
        reporter: reporter(reload)
    }));

    // inject live reload code

    let inject = `
        <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.8/socket.io.js"></script>
        <script>
            console.info('Development mode; waiting for updates...')
            io.connect(location.origin).on('reload', () => location.reload());
        </script>
    `;

    app.use((req, res, next) => {
        let send = res.send;
        res.send = function (string) {
            let body = string instanceof Buffer ? string.toString() : string;
            body = body.replace(/<\/head>/, a => inject + a);
            send.call(this, body);
        }
        next();
    })

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
