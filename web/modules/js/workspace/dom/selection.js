import d3 from '#lib/d3';
import { h, render, Component } from 'preact';
import CanvasFragment from './canvas-fragment';
import { updateWorkspace } from '#shared/workspace';
import { getMotion } from '../index';
import { ws } from '#js/socket';

export default class Selection extends Component {

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

    onResize = (node) => {
        if (node) {

        }
    };

    render({fragment: { key, target, element }}) {
        let {
            x, y, width, height, selecting, imgData, resize,
        } = element;

        // only calculate this when needed
        const handleStyleList = !selecting && [
            { left: -2, top: -2 },
            { left: (width-3)/2, top: -2 },
            { left: width -1, top: -2 },
            { left: width -1, top: (height-3)/2 },
            { left: width -1, top: height -1 },
            { left: (width-3)/2, top: height -1 },
            { left: -2, top: height -1 },
            { left: -2, top: (height-3)/2 },
        ];

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
            {__DEV__ && <pre class="debug">{target}</pre>}
            {!selecting && Array.from({length: 8}, (_,i) => (
                <div
                    class="handle"
                    style={handleStyleList[i]}
                    ref={target == 'local' && this.onResize}
                />
            ))}
            {resize && <div
                class="resize"
            />}
        </div>;
    }
}
