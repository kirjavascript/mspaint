let { normalizeXY } = require('./util');
let d3 = typeof window != 'undefined' ? require('#lib/d3').default : void 0;

function render(vdom, dom) {
    if (!dom) return;

    let vdomList = Object.keys(vdom).map((key) => {
        let obj = Object.assign({key}, vdom[key]);
        normalizeXY(obj);
        return obj;
    });

    let selection = dom.selectAll('.element').data(vdomList, (d) => d.key);

    selection.exit().remove();

    selection
        .enter()
        .append('div')
        .classed('element', 1)
        .each(function (d) {
            let element = d3.select(this);
            if (d.type == 'SELECTION_ACTIVE') {
                element.classed('select-active', 1);
            }
        })
        .merge(selection)
        .each(function (d) {
            let element = d3.select(this);
            console.log(JSON.stringify(d));
        });
}

module.exports = {
    render,
};
