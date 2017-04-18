import d3 from '#lib/d3';
import { event as d3event } from 'd3-selection';

// data

let colors = '00077770077007007700770777303326f03740f730fffbbbf00ff00f00ff30ff0fff70f77ff87ff07f73'.match(/.../g).map((d) => '#' + d);

let mice = [0, 14];

// external access

export let drawColor = {};

Object.defineProperty(drawColor, 'primary', {
    get: () => colors[mice[0]],
});

Object.defineProperty(drawColor, 'secondary', {
    get: () => colors[mice[1]],
});

// selected colours

let selectedGroup = d3.select('.palette')
    .append('div')
    .classed('current', 1);

function updateSelected() {
    let selectedSelection = selectedGroup
        .selectAll('.mice')
        .data(mice);

    selectedSelection
        .enter()
        .append('div')
        .classed('mice', 1)
        .merge(selectedSelection)
        .style('background-color', (d) => colors[d]);
}

updateSelected();

// palette

let colorGroup = d3.select('.palette')
    .append('div')
    .classed('colors', 1);

function updatePalette() {
    let colorGroupSelection = colorGroup
        .selectAll('.color')
        .data(colors);

    colorGroupSelection
        .enter()
        .append('div')
        .classed('color', 1)
        .on('click', (d, i) => {
            mice[0] = i;
            updateSelected();
        })
        .on('contextmenu', (d, i) => {
            mice[1] = i;
            updateSelected();
        })
        .merge(colorGroupSelection)
        .style('background-color', (d) => d);
}

updatePalette();
