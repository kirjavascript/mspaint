// load config //

let config;

try {
    config = require('../config.json');
}
catch (e) {
    console.log('config.json missing');
    process.exit();
}

let devMode = ~process.argv.indexOf('--dev');

// start server //

let express = require('express');
let app = express();

let server = app.set('view engine', 'ejs')
    .use(require('express-ejs-layouts'))
    .set('views', 'web/templates')
    .listen(config.port, () => {
        console.log(`Listening on ${config.port}`)
    })

// webpack-dev-middleware //

if (devMode) {
    require('./webpack-middleware')(app, server);
}

// load routes //

require('./routes')(app);

// assign static asset folders //

app.use('/', express.static('web/static'))
    .use('/', express.static('web/bundles'));