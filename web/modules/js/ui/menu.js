import d3 from '#lib/d3';
import { menuDefinition } from './menu-definition';

const body = d3.select('.window');

export const ulChar = (str, index) => {
    return index === void 0 ? str : `${str.slice(0, index)}<u>${str[index]}</u>${str.slice(index+1)}`;
};

const selectItem = (element, data) => {
    if (!selected) {
        body.on('click', () => {
            if (!element.contains(d3.event.target)) {
                closeList();
            }
        });
        selected = true;
    }
    rootItem.classed('selected', function() {
        return element == this;
    });
    listSelect
        .style('display', (d) => d != data ? 'none' : 'block');
};

const closeList = () => {
    rootItem.classed('selected', false);
    listSelect.style('display', 'none');
    body.on('click', null);
    selected = false;
};

// create menu

const menuElement = d3.select('.menu');
let selected = false;

const itemSelect = menuElement
    .selectAll('.item')
    .data(menuDefinition);

const itemEnter = itemSelect
    .enter();

const rootItem = itemEnter
    .append('div')
    .on('click', function (d) {
        selectItem(this, d);
    })
    .on('mouseenter', function(d) {
        selected && selectItem(this, d);
    })
    .classed('item', true);

// text
rootItem
    .append('span')
    .html(({name, ulIndex}) => ulChar(name, ulIndex));

// list
const listSelect = rootItem
    .append('div')
    .each(function () {
        const { top, left } = this.parentNode.getBoundingClientRect();

        d3.select(this)
            .style('top', top - 5 + 'px')
            .style('left', left - 5 + 'px');
    })
    .classed('list', true);
listSelect
    .append('div')
    .selectAll('.list-item')
    .data((d) => d.children || [])
    .enter()
    .append('div')
    .classed('list-item', true)
    .classed('hr', (d) => d.hr)
    .on('click', (d) => {
        if (d.action) {
            d3.event.stopPropagation();
            closeList();
            d.action();
        }
    })
    .html(({name, ulIndex}) => name && ulChar(name, ulIndex));
