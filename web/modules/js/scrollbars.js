import d3 from '#lib/d3';
import { CANVAS } from '#shared/constants';

export let scrollPos = [0,0];

let workspace = d3.select('.workspace');

// draw bars

let bottomScroll = workspace.append('div').classed('scrollbar bottom', 1);
let bottomWrap = bottomScroll.append('div');

bottomWrap.append('div').classed('arrowBlock left', 1);
let bottomBar = bottomWrap.append('div').classed('bar bottom', 1);
bottomWrap.append('div').classed('arrowBlock right', 1);

// handl resizing

function responder() {
    let { width, height } = workspace.node().getBoundingClientRect();
    let { width: bWidth, height:bHeight } = bottomWrap.node().getBoundingClientRect();
    let bRatio = (width -6) / CANVAS.width;
    let bottomWidth = bRatio*width;

    if (bRatio < 1) {
        bottomScroll.style('display', '');
        bottomBar.style('width', `${bottomWidth}px`);
    }
    else {
        bottomScroll.style('display', 'none');
    }
}

responder();
d3.select(window).on('resize', responder);
