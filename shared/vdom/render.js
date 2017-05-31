let render = typeof __WEB__ != 'undefined'
    ? require('./render-preact')
    : () => false;

module.exports = {
    render,
};
