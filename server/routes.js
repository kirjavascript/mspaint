let { getPNG } = require('./canvas');
let { getVDOM } = require('../shared/workspace');
let Canvas = require('canvas');

function routes(app) {

    app.get('/', (req, res) => {
        res.render('index');
    });

    // provide PNG of canvas for preloading
    app.get('/canvas.png', (req, res) => {
        res.writeHead(200, {'Content-Type': 'image/png'});
        getPNG((err, buf) => {
            res.end(buf);
        });
    });

    // provide access to VDOM canvas fragments
    app.get('/vdom/:uid', (req, res) => {
        let { uid } = req.params;
        let vdom = getVDOM(uid);
        if (!vdom) return res.send('nope');
        let { width, height, imgData } = vdom;
        let canvas = new Canvas(width, height);
        let ctx = canvas.getContext('2d');
        ctx.putImageData(imgData, 0, 0, 0, 0, width, height);
        canvas.toBuffer((err, buf) => {
            res.end(buf);
        });
    });
}

module.exports = routes;

