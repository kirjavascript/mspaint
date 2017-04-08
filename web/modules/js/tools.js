import d3 from '#lib/d3';

let tools = [
    {

    },
];

tools = new Array(16).fill({d:1});

let toolbox = d3.select('.toolbox');

let selection = toolbox.selectAll('.tool')
    .data(tools);

let enter = selection.enter()
    .append('div')
    .classed('tool', 1)
    .append('div');

enter.append('img')
    .attr('src', 'tools/up.png');

enter.append('img')
    .attr('src', (d,i) => `tools/${i}.png`);
