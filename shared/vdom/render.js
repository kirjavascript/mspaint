let { normalizeObj } = require('./util');
let d3 = typeof window != 'undefined' ? require('#lib/d3').default : void 0;

// currently, this function should nop in node

function render(vdom, dom) {
    if (!dom || !d3) return;

    let vdomList = Object.keys(vdom).map((target) => {
        let key = `${target}:${vdom[target].type}`;
        let obj = Object.assign({key, target}, vdom[target]);
        normalizeObj(obj);
        return obj;
    });

    let selection = dom.selectAll('.element').data(vdomList, (d) => d.key);

    selection.exit().remove();

    selection
        .enter()
        .append('div')
        .classed('element', 1)
        .classed('local', (d) => d.target == 'local')
        .each(function (d) {
            let element = d3.select(this);

            if (d.type == 'SELECTION') {
                element.classed('selection', 1);
            }
        })
        .merge(selection)
        .each(function (d) {
            let element = d3.select(this);

            if (d.type == 'SELECTION') {
                element
                    .classed('selecting', d.selecting)
                    .style('top', d.y + 'px')
                    .style('left', d.x + 'px')
                    .style('width', d.width + 'px')
                    .style('height', d.height + 'px');
            }
        });
}

module.exports = {
    render,
};
