import d3 from '#lib/d3';

let tools = [
    {

    },
];

tools = new Array(16).fill();

let toolbox = d3.select('.toolbox');

let selection = d3.selectAll('.tool')
    .data(tools);

let enter = selection.enter()
    .append('div');

enter.append('img')
    .attr('src', (d,i) => `${i}.png`);
console.log('asda');
