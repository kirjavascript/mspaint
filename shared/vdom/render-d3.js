let d3 = typeof __WEB__ != 'undefined' ? require('#lib/d3').default : void 0;
let dom = typeof __WEB__ != 'undefined' ? document.querySelector('.dom') : void 0;
let { normalizeObj } = require('./util');

function render(vdom) {
    if (!dom || !d3) return;

    let vdomList = Object.keys(vdom).map((target) => {
        let key = `${target}:${vdom[target].type}`;
        let obj = Object.assign({key, target}, vdom[target]);
        return obj;
    });

    let selection = d3.select(dom).selectAll('.element').data(vdomList, (d) => d.key);

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

                if (d.imgData && !this.querySelector('canvas')) {
                    element
                        .append('canvas')
                        .attr('width', d.width + 'px')
                        .attr('height', d.height + 'px')
                        .each(function(d) {
                            let ctx = this.getContext('2d');
                            ctx.putImageData(d.imgData, 0, 0, 0, 0, d.width, d.height);
                        });
                }
                else if (!d.imgData) {
                    element.select('canvas').remove();
                }
            }
        });
}

module.exports = { render };
