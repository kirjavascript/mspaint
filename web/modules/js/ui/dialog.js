import d3 from '#lib/d3';
import { dragFilter } from '#workspace';
import { ding } from '#ui/audio';

const mainTitlebar = d3.select('.titlebar');

// add cover

export function dialog({title, width, height, x = 0, y = 0, onLoad, contentClass}) {

    mainTitlebar.classed('unfocused', true);

    x = Math.max(x + (window.innerWidth/2) - (width/2), 0);
    y = Math.max(y + (window.innerHeight/2) - (height/2), 0);

    const overlay = d3
        .select(document.body)
        .append('div')
        .classed('dialog-overlay', true)
        .on('click', ding);

    const element = d3
        .select(document.body)
        .append('div')
        .classed('dialog', true)
        .on('move', function () {
            d3.select(this)
                .style('top', y + 'px')
                .style('left', x + 'px');
        })
        .dispatch('move');

    const body = element
        .append('div')
        .style('width', width && `${width}px`)
        .style('height', height && `${height}px`);

    const titlebar = body
        .append('div')
        .classed('titlebar', true);

    titlebar
        .append('span')
        .html(title);

    const close = () => {
        element.remove();
        overlay.remove();
        mainTitlebar.classed('unfocused', false);
    };

    const closeIcon = body
        .append('div')
        .classed('close', true)
        .on('click', close);

    titlebar.call(d3.drag()
        .filter(dragFilter)
        .container(element.node().parentNode)
        .on('drag', () => {
            const { dx, dy } = d3.event;
            x += dx;
            y += dy;
            element.dispatch('move');
        }));

    const content = body.append('div').classed(contentClass, true);

    onLoad && onLoad(content);
}
