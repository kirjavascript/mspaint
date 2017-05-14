// load config //

let config;

try {
    config = require('../config.json');
}
catch (e) {
    console.log('config.json missing');
    process.exit();
}

let devMode = ~process.argv.indexOf('--env.dev');

// start server //

let express = require('express');
let app = express();

let server = app.set('view engine', 'ejs')
    .use(require('express-ejs-layouts'))
    .set('views', 'web/templates')
    .use(require('compression')())
    .listen(config.port, () => {
        console.log(`Listening on ${config.port}`)
    })

// sockets //

let WebSocket = require('ws');

let wss = new WebSocket.Server({server});

let { initSocket } = require('./socket');

initSocket(app, wss);

// webpack-dev-middleware //

if (devMode) {
    require('./webpack-middleware')(app, wss);
}

// load routes //

require('./routes')(app, wss);

// assign static asset folders //

app.use('/', express.static('web/static'))
    .use('/', express.static('web/bundles'));
