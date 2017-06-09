import d3 from '#lib/d3';
import { setScroll, scrollPos } from '#ui/scrollbars';
import { updateWorkspace, getVDOM } from '#shared/workspace';
import { ws, wsMessage } from '#js/socket';

import './cursors';
import './canvas';
import './dom/index';

wsMessage.on('message.workspace', ({message}) => {

    if (message.cmd.indexOf('CANVAS_') == 0) {
        updateWorkspace(message);
    }
    else if (message.cmd.indexOf('DOM_') == 0) {
        updateWorkspace(message);
    }
    else if (message.cmd == 'PART') {
        updateWorkspace({
            cmd: 'DOM_PART',
            uid: message.uid,
        });
    }

});

export function getMotion() {
    let { x, y, dx, dy } = d3.event;
    let { zoom } = scrollPos;
    return {
        x: (x / zoom),
        y: (y / zoom),
        dx: (dx / zoom),
        dy: (dy / zoom),
    };
}
