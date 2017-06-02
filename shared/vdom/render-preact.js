import { h, render as renderDOM, Component } from 'preact';
import { normalizeObj } from './util';
import { getVDOM } from './index';
import d3 from '#lib/d3';

const dom = document.querySelector('.dom');

let render = () => null;
class Container extends Component {

    constructor(props) {
        super(props);

        this.state = {
            vdom: [],
        };

        render = (vdom) => {
            this.setState({vdom: Object.keys(vdom).map((target) => {
                let key = `${target}:${vdom[target].type}`;
                return {
                    key,
                    target,
                    element: vdom[target],
                };
            })});
        };
    }

    onMove = (node) => {
        if (node) {
            d3.select(node)
                .call(d3.drag()
                .on('drag', () => {
                    let { dx, dy } = require('d3-selection').event;
                    let obj = {
                        cmd: 'DOM_MOVE',
                        dx, dy,
                    };
                    require('#js/socket').ws.sendObj(obj);
                    require('#shared/workspace').updateWorkspace(obj);
                }));
        }
    };

    render(props, {vdom}) {
        return <div>
            <pre class="debug">
                {JSON.stringify(vdom,null,4)}
            </pre>
            {vdom.map((fragment) => {
                let {
                    key, target, element,
                } = fragment;
                let {
                    x, y, width, height, selecting, imgData
                } = element;
                return <div
                    class={`
                        element
                        selection
                        ${selecting ?'selecting':''}
                        ${target == 'local' ? 'local' : ''}
                    `}
                    style={{
                        top: y,
                        left: x,
                        width: width,
                        height: height,
                    }}
                    key={key}
                    ref={target == 'local' && this.onMove}
                >
                    {imgData && <CanvasFragment element={element} target={target}/>}
                    <pre class="debug">{target}</pre>
                </div>;
            })}
        </div>;
    }
}

class CanvasFragment extends Component {
    loadImgData = (node) => {
        if (node) {
            node.imageSmoothingEnabled = true;
            requestAnimationFrame(() => {
                let { target, element } = this.props;
                let { width, height, imgData } = element;

                if (imgData == 'USE_PNG') {
                    let ctx = node.getContext('2d');
                    let img = new Image();
                    img.onload = function() {
                        ctx.drawImage(this, 0, 0);
                    };
                    img.src = '/vdom/' + target;
                    // mutating props is dangerous! but we don't need a rerender...
                    this.props.element.imgData = ctx.getImageData(0, 0, width, height);
                }
                else {
                    let ctx = node.getContext('2d');
                    ctx.putImageData(imgData, 0, 0, 0, 0, width, height);
                }
            });
        }
    };

    render({element: {width, height}}) {
        return <canvas
            ref={this.loadImgData}
            width={width}
            height={height}
        />;
    }
}

__WEB__ &&
renderDOM(<Container/>, null, dom);

export {
    render,
    CanvasFragment,
    Container,
};
