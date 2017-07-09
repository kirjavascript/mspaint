import d3 from '#lib/d3';

// File Edit View Colors Help

let menuDefinition = [
    {
        name: 'File',
        children: [
            {
                name: 'Save',
                action() {
                    alert('save');
                },
            },
            {
                name: 'Print',
                action() {
                    alert('print');
                },
            },
        ],
    },
    {
        name: 'Edit',
        children: [],
    },
    {
        name: 'Help',
        children: [
            {
                name: 'Save',
                action() {
                    alert('save');
                },
            },
            {
                hr: true,
            },
            {
                name: 'Print',
                action() {
                    console.log('print');
                },
            },
        ],
    },
];


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
    .html((d) => `<u>${d.name[0]}</u>${d.name.slice(1)}`);

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
    .text((d) => d.name);


const body = d3.select('.window');

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
