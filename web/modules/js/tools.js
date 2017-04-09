import d3 from '#lib/d3';

export let selected = 6;

let tools = [
    'LINE',
];

let toolbox = d3.select('.toolbox');

let selection = toolbox.selectAll('.tool')
    .data(new Array(16).fill({}));

let enter = selection.enter()
    .append('div')
    .classed('tool', 1)
    .append('div')
    .on('mousedown', selectTool);

enter.append('img')
    .attr('src', (d,i) => `tools/${i==selected?'down':'up'}.png`);

enter.append('img')
    .attr('src', (d,i) => `tools/${i}.png`);

function selectTool(d, i) {
    toolbox.select(`.tool:nth-child(${selected+1})`)
        .select('img')
        .attr('src', 'tools/up.png');
    d3.select(this)
        .select('img')
        .attr('src', 'tools/down.png');
    selected = i;
}
