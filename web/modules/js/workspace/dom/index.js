import { h, render, Component } from 'preact';
import { vdomEmitter } from '#shared/vdom';
import Selection from './selection';

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
    render(props, {vdom}) {
        return <div>
            {__DEV__ && <pre class="debug">
                {JSON.stringify(vdom,(k,v)=>k=='imgData'?'__removed__':v,4)}
            </pre>}
            {vdom.map((fragment) => {
                return <Selection fragment={fragment}/>;
            })}
        </div>;
    }
}

render(<Container/>, null, document.querySelector('.dom'));
