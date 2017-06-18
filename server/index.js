// load config //

let { PORT } = require('../shared/constants');

let devMode = ~process.argv.indexOf('--env.dev');

// start server //

let express = require('express');
let app = express();

let server = app.set('view engine', 'ejs')
    .use(require('express-ejs-layouts'))
    .set('views', 'web/templates')
    .use(require('compression')())
    .listen(PORT, () => {
        !devMode && console.info(`Listening on ${PORT}`)
    });

// sockets //

let WebSocket = require('ws');

let wss = new WebSocket.Server({server});

let { initSocket } = require('./socket');

initSocket(app, wss);

// webpack-dev-middleware //

if (devMode) {
    require('./development-middleware')(app, wss, server);
}

// load routes //

require('./routes')(app, wss);

// assign static asset folders //

app.use('/', express.static('web/static'))
    .use('/', express.static('web/bundles'));
