import d3 from '#lib/d3';
import { setScroll, scrollPos } from '#js/scrollbars';

import './cursors';
import './canvas';
import './dom';

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
