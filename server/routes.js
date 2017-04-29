let { getPNG } = require('./canvas');

function routes(app) {

    app.get('/', (req, res) => {
        res.render('index');
    });

    app.get('/canvas.png', (req, res) => {
        res.writeHead(200, {'Content-Type': 'image/png'});
        // res.end(getPNG());
        getPNG((err, buf) => {
            res.end(buf);
        });
    });
}

module.exports = routes;

