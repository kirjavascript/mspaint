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
                name: 'Print',
                action() {
                    alert('print');
                },
            },
        ],
    },
];

import { h, render, Component } from 'preact';

class Menu extends Component {

    state = {
        selectedIndex: void 0,
    };

    openMenu = () => {
        
    };

    render() {
        return <div>
            {menuDefinition.map((data) => (
                <List data={data} onClick/>
                <div key={name}>
                    <div class="item" onClick={this.openMenu}>
                        <u>{name[0]}</u>{name.slice(1)}
                    </div>
                    <div class="list">
                        {children.map(({name, action}) => (
                            <div>
                                {name}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>;
    }
}

class List extends Component {
    render() {

    }
}

render(<Menu/>, null, d3.select('.menu').node());

// let selected = false;
// const menuElement = d3.select('.menu');

// const itemSelect = menuElement
//     .selectAll('.item')
//     .data(menuDefinition);

// const itemEnter = itemSelect
//     .enter()
//     .append('div')
//     .on('click', function () {
//         selectItem(this);
//     })
//     .on('mouseover', function() {
//         if (selected) {
//             selectItem(this);
//         }
//     })
//     .classed('item', true);

// const selectItem = (element) => {
//     itemEnter.classed('selected', function() {
//         return element == this;
//     });
//     const body = d3.select(document.body);
//     body.on('click', () => {
//         if (!element.contains(d3.event.target)) {
//             d3.select(element).classed('selected', false);
//             body.on('click', null);
//             selected = false;
//         }
//     });
//     selected = true;
// };

// itemEnter
//     .append('span')
//     .html((d) => {
//         return `<u>${d.name[0]}</u>${d.name.slice(1)}`;
//     });

// const listEnter = itemEnter
//     .selectAll('.listitem')
//     .data((d) => {console.log(d.children);return d.children || [];})
//     .enter()
//     .append('div')
//     .text((d) => d.name);
