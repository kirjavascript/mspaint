import d3 from '#lib/d3';
import { CANVAS } from '#shared/constants';

export let scrollPos = {x: 0, y: 0, zoom: 1};
export let setScroll = ({ zoom, x, y } = {}) => {
    zoom && (scrollPos.zoom = zoom);
    // rightOffset, bottomOffset and scroll x/y get redefined in responder
    x && (bottomOffsetRatio = x / CANVAS.width);
    y && (rightOffsetRatio = y / CANVAS.height);
    responder();
};

let workspace = d3.select('.workspace');
let canvasWrap = d3.select('.canvasWrap');

// draw bars

let bottomScroll = workspace.append('div').classed('scrollbar bottom', 1);
let bottomWrap = bottomScroll.append('div');

let [arrowBL, bottomBar, arrowBR] = [
    bottomWrap.append('div').classed('arrowBlock left', 1),
    bottomBar = bottomWrap.append('div').classed('bar bottom', 1),
    bottomWrap.append('div').classed('arrowBlock right', 1),
];

let rightScroll = workspace.append('div').classed('scrollbar right', 1);
let rightWrap = rightScroll.append('div');

let [arrowRU, rightBar, arrowRD] = [
    rightWrap.append('div').classed('arrowBlock top', 1),
    rightBar = rightWrap.append('div').classed('bar right', 1),
    rightWrap.append('div').classed('arrowBlock bottom', 1),
];

d3.selectAll('.scrollbar').style('display', 'none');

// draw arrows

[arrowRU, arrowRD, arrowBL, arrowBR]
    .forEach((block, i) => {
        block.append('svg')
            .classed('arrow', 1)
            .attr('width', '14px')
            .attr('height', '14px')
            .append('path')
            .attr('d', 'M0,0V7L4,3.5Z')
            .attr('transform', `translate(5, 3) rotate(${[-90, 90, 180, 0][i]} 2 3.5)`);
    });

function getDimensions() {
    const { width, height } = workspace.node().getBoundingClientRect();

    const canvasWidth = CANVAS.width * scrollPos.zoom;
    const canvasHeight = CANVAS.height * scrollPos.zoom;

    const bottomRatio = (width -6) / canvasWidth;
    const rightRatio = (height -4) / canvasHeight;

    const showBottom = bottomRatio < 1 && width > (17 * 3) && height > 17;
    const showRight = rightRatio < 1 && height > (17 * 3) && width > 17;

    const showBoth = showBottom && showRight;

    const bottomWidth = width - 36 + (+showBoth * -16);
    const rightWidth = height - 35 + (+showBoth * -16);

    const bottomBarWidth = bottomRatio * bottomWidth;
    const rightBarWidth = rightRatio * rightWidth;

    const bottomMaxDelta = bottomWidth - bottomBarWidth - 1;
    const rightMaxDelta = rightWidth - rightBarWidth - 1;

    const bottomMaxWorkspaceDelta = canvasWidth - width + (+showRight * 16) + 9;
    const rightMaxWorkspaceDelta = canvasHeight - height + (+showBottom * 16) + 8;

    return {
        bottomBarWidth, bottomWidth, bottomMaxDelta,
        rightBarWidth, rightWidth, rightMaxDelta,
        bottomRatio, rightRatio,
        showBoth, showBottom, showRight,
        bottomMaxWorkspaceDelta, rightMaxWorkspaceDelta,
    };
}

// dragging / scrolling

let bottomOffset = 0;
let bottomOffsetRatio = 0;

bottomBar
    .call(d3.drag().on('drag', () => {
        let { dx } = d3.event;
        let { bottomBarWidth, bottomWidth, bottomMaxDelta, bottomMaxWorkspaceDelta } = getDimensions();
        // set scrollbar position
        let newOffset = bottomOffset + dx;
        bottomOffset = Math.max(0, Math.min(newOffset, bottomMaxDelta));
        bottomOffsetRatio = bottomOffset / bottomMaxDelta;
        bottomBar.style('transform', `translateX(${bottomOffset}px)`);
        // set canvas position
        scrollPos.x = bottomOffsetRatio * bottomMaxWorkspaceDelta / scrollPos.zoom;
        canvasWrap.style('transform', `scale(${scrollPos.zoom}) translate(${-scrollPos.x}px, ${-scrollPos.y}px)`);
    }));

let rightOffset = 0;
let rightOffsetRatio = 0;

rightBar
    .call(d3.drag().on('drag', () => {
        let { dy } = d3.event;
        let { rightBarWidth, rightWidth, rightMaxDelta, rightMaxWorkspaceDelta } = getDimensions();
        // set scrollbar position
        let newOffset = rightOffset + dy;
        rightOffset = Math.max(0, Math.min(newOffset, rightMaxDelta));
        rightOffsetRatio = rightOffset / rightMaxDelta;
        rightBar.style('transform', `translateY(${rightOffset}px)`);
        // set canvas position
        scrollPos.y = rightOffsetRatio * rightMaxWorkspaceDelta / scrollPos.zoom;
        canvasWrap.style('transform', `scale(${scrollPos.zoom}) translate(${-scrollPos.x}px, ${-scrollPos.y}px)`);
    }));

// handl resizing

function responder() {
    let {
        bottomBarWidth,
        rightBarWidth,
        bottomMaxDelta,
        rightMaxDelta,
        bottomMaxWorkspaceDelta,
        rightMaxWorkspaceDelta,
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

    // right bar
    
    rightOffset = rightOffsetRatio * rightMaxDelta;
    scrollPos.y = rightOffsetRatio * rightMaxWorkspaceDelta / scrollPos.zoom;
    if (scrollPos.y <= 0) {
        rightOffset = rightOffsetRatio = scrollPos.y = 0;
    }
    rightBar.style('transform', `translateY(${rightOffset}px)`);

    if (showRight) {
        rightScroll.style('display', '');
        rightBar.style('height', `${rightBarWidth}px`);
    }
    else {
        rightScroll.style('display', 'none');
    }

    // bottom bar
    
    bottomOffset = bottomOffsetRatio * bottomMaxDelta;
    scrollPos.x = bottomOffsetRatio * bottomMaxWorkspaceDelta / scrollPos.zoom;
    if (scrollPos.x <= 0) {
        bottomOffset = bottomOffsetRatio = scrollPos.x = 0;
    }
    bottomBar.style('transform', `translateX(${bottomOffset}px)`);

    if (showBottom) {
        bottomScroll.style('display', '');
        bottomBar.style('width', `${bottomBarWidth}px`);
    }
    else {
        bottomScroll.style('display', 'none');
    }

    // set scroll position / zoom
    canvasWrap.style('transform', `scale(${scrollPos.zoom}) translate(${-scrollPos.x}px, ${-scrollPos.y}px)`);
}

d3.select(window).on('resize', () => {
    requestAnimationFrame(responder);
});
