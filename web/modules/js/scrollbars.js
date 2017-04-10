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

let rightScroll = workspace.append('div').classed('scrollbar right', 1);
let rightWrap = rightScroll.append('div');

rightWrap.append('div').classed('arrowBlock top', 1);
let rightBar = rightWrap.append('div').classed('bar right', 1);
rightWrap.append('div').classed('arrowBlock bottom', 1);


// handl resizing

function responder() {
    let { width, height } = workspace.node().getBoundingClientRect();
    let { width: bWidth, height:bHeight } = bottomWrap.node().getBoundingClientRect();
    let bRatio = (width -6) / CANVAS.width;
    let rRatio = (height -4) / CANVAS.height;

    let bottomWidth = bRatio*width-36;
    let rightWidth = rRatio*height-35;

    if (rRatio < 1 && bRatio < 1) {
        bottomWidth -=16;
        rightWidth -= 16;
        rightScroll.style('bottom', '16px');
        bottomScroll.style('right', '17px');
    }
    else {
        rightScroll.style('bottom', 0);
        bottomScroll.style('right', '1px');
    }

    if (rRatio < 1) {
        rightScroll.style('display', '');
        rightBar.style('height', `${rightWidth}px`);
    }
    else {
        rightScroll.style('display', 'none');
    }

    if (bRatio < 1) {
        bottomScroll.style('display', '');
        bottomBar.style('width', `${bottomWidth}px`);
    }
    else {
        bottomScroll.style('display', 'none');
    }
}

responder();
d3.select(window).on('resize', () => {
    requestAnimationFrame(responder);
});
