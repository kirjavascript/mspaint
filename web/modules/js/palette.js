import d3 from '#lib/d3';

let colors = '00077770077007007700770777303326f03740f730fffbbbf00ff00f00ff30ff0fff70f77ff87ff07f73'.match(/.../g).map((d) => '#' + d);

let mice = [0, 14];

let current = d3.select('.palette')
    .append('div')
    .classed('current', 1)
    .selectAll('.mice')
    .data(mice);

current
    .enter()
    .append('div')
    .style('background-color', (d) => colors[d]);

let colorList = d3.select('.palette')
    .append('div')
    .classed('colors', 1)
    .selectAll('.color')
    .data(colors);

colorList
    .enter()
    .append('div')
    .classed('color',1)
    .style('background-color', (d) => d);
