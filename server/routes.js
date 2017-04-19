let { getPNG } = require('./canvas');

function routes(app) {

    app.get('/', (req, res) => {
        res.render('index');
    });

    app.get('/canvas.png', (req, res) => {
        res.send(getPNG());
    });
}

module.exports = routes;

