let { dispatch } = require('d3-dispatch');
let vdomEmitter = dispatch('render');

function render(vdom) {
    typeof __WEB__ != 'undefined' &&
    vdomEmitter.call('render', void 0, vdom);
}

module.exports = {
    render,
    vdomEmitter,
};
