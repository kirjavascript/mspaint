const { freemem, totalmem } = require('os');
const { getPNG } = require('./canvas');
const { getVDOM } = require('../shared/workspace');
const Canvas = require('canvas');

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
        if (!vdom) return res.sendStatus(500);
        let { width, height, imgData } = vdom;
        let canvas = new Canvas(width, height);
        let ctx = canvas.getContext('2d');
        ctx.putImageData(imgData, 0, 0, 0, 0, width, height);
        canvas.toBuffer((err, buf) => {
            res.end(buf);
        });
    });

    // system resources
    app.get('/mem', (req, res) => {
        const [free, total] = [freemem(), totalmem()];
        const i = Math.floor(Math.log(freemem) / Math.log(1e3));
        const physical = (0|(freemem / 1e3 ** i)) + ['B','KB','MB','GB'][i];
        const resources = `${0|(freemem/totalmem)*100}% Free`;

        res.json({
            physical, resources,
        });
    });
}

module.exports = routes;
