let render = typeof __WEB__ != 'undefined'
    ? require('./render-preact').render
    : () => false;

module.exports = {
    render,
};
