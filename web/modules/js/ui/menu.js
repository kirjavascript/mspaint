import d3 from '#lib/d3';

// File Edit View Colors Help

const menuDefinition = [
    {
        name: 'File',
    },
    {
        name: 'Edit',
    },
    {
        name: 'Help',
    },
];

let selected = false;
const menuElement = d3.select('.menu');

const itemSelect = menuElement
    .selectAll('.item')
    .data(menuDefinition);

const itemEnter = itemSelect
    .enter()
    .append('div')
    .on('click', function () {
        selectItem(this);
    })
    .on('mouseover', function() {
        if (selected) {
            selectItem(this);
        }
    })
    .classed('item', true);

const selectItem = (element) => {
    itemEnter.classed('selected', function() {
        return element == this;
    });
    const body = d3.select(document.body);
    body.on('click', () => {
        if (!element.contains(d3.event.target)) {
            d3.select(element).classed('selected', false);
            body.on('click', null);
            selected = false;
        }
    });
    selected = true;
};

itemEnter
    .append('span')
    .html((d) => {
        return `<u>${d.name[0]}</u>${d.name.slice(1)}`;
    });
