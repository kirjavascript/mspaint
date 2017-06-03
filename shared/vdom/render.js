let render = typeof __WEB__ != 'undefined'
    ? require('#js/workspace/dom').render
    : () => false;

module.exports = {
    render,
};
