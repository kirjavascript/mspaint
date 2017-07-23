import d3 from '#lib/d3';
import { dragFilter } from '#workspace';

const mainTitlebar = d3.select('.titlebar');

// add cover

export function dialog({title, width, height, x = 0, y = 0}) {

    mainTitlebar.classed('unfocused', true);

    x = Math.max(x + (window.innerWidth/2) - (width/2), 0);
    y = Math.max(y + (window.innerHeight/2) - (height/2), 0);

    const overlay = d3
        .select(document.body)
        .append('div')
        .classed('dialog-overlay', true);

    const element = d3
        .select(document.body)
        .append('div')
        .classed('dialog', true)
        .style('top', y + 'px')
        .style('left',  x + 'px');

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

    const closeIcon = titlebar
        .append('div')
        .classed('close', true)
        .on('click', close);

    titlebar.call(d3.drag()
        .filter(dragFilter)
        .container(element.node().parentNode)
        .on('drag', function (){
            const { dx, dy } = d3.event;
            x += dx;
            y += dy;
            element
                .style('top', y + 'px')
                .style('left', x + 'px');
        }));

    body.append('div')
        .html('<hr/>');

}

dialog({
    title: 'About Paint',
    width: 348,
    height: 283,
    y: -100,
});
