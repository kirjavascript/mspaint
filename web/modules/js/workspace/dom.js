import d3 from '#lib/d3';
import { h, render, Component } from 'preact';
import { vdomEmitter } from '#shared/vdom';
import { updateWorkspace } from '#shared/workspace';
import { ws } from '#js/socket';
import { getMotion } from './index';
import CanvasFragment from './canvas-fragment';

class Container extends Component {

    constructor(props) {
        super(props);

        this.state = {
            vdom: [],
        };

        vdomEmitter.on('render', (vdom) => {
            this.setState({vdom: Object.keys(vdom).map((target) => {
                let key = `${target}:${vdom[target].type}`;
                return {
                    key,
                    target,
                    element: vdom[target],
                };
            })});
        });
    }

    onMove = (node) => {
        if (node) {
            d3.select(node)
                .call(d3.drag()
                .on('drag', () => {
                    let { dx, dy } = getMotion();
                    let obj = {
                        cmd: 'DOM_MOVE',
                        dx, dy,
                    };
                    ws.sendObj(obj);
                    updateWorkspace(obj);
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

render(<Container/>, null, document.querySelector('.dom'));
