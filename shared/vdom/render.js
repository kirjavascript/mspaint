let { normalizeObj, getDOM } = require('./util');
let { h, render: renderDOM, Component } = require('preact');
let dom = typeof __WEB__ != 'undefined' ? document.querySelector('.dom') : void 0;

// currently, this function should nop in node

let render = () => null;
class Container extends Component {

    state = {
        vdom: [],
    };

    constructor(props) {
        super(props);

        render = (vdom) => {
            this.setState({vdom: Object.keys(vdom).map((target) => {
                let key = `${target}:${vdom[target].type}`;
                let obj = Object.assign({key, target}, vdom[target]);
                normalizeObj(obj);
                return obj;
            })});
        };
    }

    render(props, {vdom}) {
        return <div>
            {vdom.map((element) => {
                return <div
                    class={`element selection ${element.selecting ?'selecting':''}`}
                    style={{
                        top: element.y,
                        left: element.x,
                        width: element.width,
                        height: element.height,
                    }}
                    key={element.key}
                >
                    <CanvasFragment data={element}/>
                </div>;
            })}
        </div>;
    }
}

class CanvasFragment extends Component {
    loadImgData = (node) => {
        if (node) {
            requestAnimationFrame(() => {
                let ctx = node.getContext('2d');
                let { imgData, width, height } = this.props.data;
                ctx.putImageData(imgData, 0, 0, 0, 0, width, height);
            });
        }
    };

    render({data: {imgData, width, height}}) {
        return imgData ? <canvas
            ref={this.loadImgData}
            width={width}
            height={height}
        /> : false;
    }
}

__WEB__ &&
renderDOM(<Container/>, dom);

// let d3 = typeof __WEB__ != 'undefined' ? require('#lib/d3').default : void 0;
//
// function render(vdom) {
//     if (!dom || !d3) return;

//     let vdomList = Object.keys(vdom).map((target) => {
//         let key = `${target}:${vdom[target].type}`;
//         let obj = Object.assign({key, target}, vdom[target]);
//         normalizeObj(obj);
//         return obj;
//     });

//     let selection = d3.select(dom).selectAll('.element').data(vdomList, (d) => d.key);

//     selection.exit().remove();

//     selection
//         .enter()
//         .append('div')
//         .classed('element', 1)
//         .classed('local', (d) => d.target == 'local')
//         .each(function (d) {
//             let element = d3.select(this);

//             if (d.type == 'SELECTION') {
//                 element.classed('selection', 1);
//             }
//         })
//         .merge(selection)
//         .each(function (d) {
//             let element = d3.select(this);

//             if (d.type == 'SELECTION') {
//                 element
//                     .classed('selecting', d.selecting)
//                     .style('top', d.y + 'px')
//                     .style('left', d.x + 'px')
//                     .style('width', d.width + 'px')
//                     .style('height', d.height + 'px');

//                 if (d.imgData && !this.querySelector('canvas')) {
//                     element
//                         .append('canvas')
//                         .attr('width', d.width + 'px')
//                         .attr('height', d.height + 'px')
//                         .each(function(d) {
//                             let ctx = this.getContext('2d');
//                             ctx.putImageData(d.imgData, 0, 0, 0, 0, d.width, d.height);
//                         });
//                 }
//                 else if (!d.imgData) {
//                     element.select('canvas').remove();
//                 }
//             }
//         });
// }

module.exports = {
    render,
};
