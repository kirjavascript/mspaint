import d3 from '#lib/d3';
import { event as d3event } from 'd3-selection';
import { CANVAS } from '#shared/constants';

export let scrollPos = {x: 0, y: 0};

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

function getDimensions() {
    let { width, height } = workspace.node().getBoundingClientRect();
    let { width: bWidth, height:bHeight } = bottomWrap.node().getBoundingClientRect();
    let bottomRatio = (width -6) / CANVAS.width;
    let rightRatio = (height -4) / CANVAS.height;
    
    let showBottom = bottomRatio < 1;
    let showRight = rightRatio < 1;
    let showBoth = showBottom && showRight;

    let bottomWidth = width - 36 + (+showBoth * -16);
    let rightWidth = height - 35 + (+showBoth * -16);

    let bottomBarWidth = bottomRatio*bottomWidth;
    let rightBarWidth = rightRatio*rightWidth;

    let bottomMaxDelta = bottomWidth - bottomBarWidth - 1;


    return {
        bottomBarWidth, bottomWidth,
        bottomMaxDelta,
        rightBarWidth, rightWidth,
        bottomRatio, rightRatio,
        showBoth, showBottom, showRight,
    };
}

// dragging / scrolling

let bottomOffset = 0;
let bottomOffsetRatio = 0;

bottomBar
    .call(d3.drag().on('drag', () => {
        let { dx } = d3event;
        let { bottomBarWidth, bottomWidth, bottomMaxDelta } = getDimensions();
        let newOffset = bottomOffset + dx;
        bottomOffset = Math.max(0, Math.min(newOffset, bottomMaxDelta));
        bottomOffsetRatio = bottomOffset / bottomMaxDelta;
        
        bottomBar.style('transform', `translateX(${bottomOffset}px)`);
    }));

// handl resizing

function responder() {
    let {
        bottomBarWidth,
        rightBarWidth,
        bottomMaxDelta,
        showBottom,
        showLeft,
        showRight,
        showBoth,
    } = getDimensions();

    if (showBoth) {
        rightScroll.style('bottom', '16px');
        bottomScroll.style('right', '17px');
    }
    else {
        rightScroll.style('bottom', 0);
        bottomScroll.style('right', '1px');
    }

    if (showRight) {
        rightScroll.style('display', '');
        rightBar.style('height', `${rightBarWidth}px`);
    }
    else {
        rightScroll.style('display', 'none');
    }

    if (showBottom) {
        bottomScroll.style('display', '');
        bottomBar.style('width', `${bottomBarWidth}px`);
        // update bar offset
        bottomOffset = bottomOffsetRatio * bottomMaxDelta;
        bottomBar.style('transform', `translateX(${bottomOffset}px)`);
    }
    else {
        bottomScroll.style('display', 'none');
    }
}

responder();
d3.select(window).on('resize', () => {
    requestAnimationFrame(responder);
});
