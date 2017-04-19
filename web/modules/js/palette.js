import d3 from '#lib/d3';
import { event as d3event } from 'd3-selection';

// data

let colors = '00077770077007007700770777303326f03740f730fffbbbf00ff00f00ff30ff0fff70f77ff87ff07f73'.match(/.../g).map((d) => '#' + d);

// external access

export let drawColor = {
    primary: '#000',
    secondary: '#FFF',
};

// set colour

export function setColor(obj) {
    Object.assign(drawColor, obj);
    updateSelected();
}

// selected colours

let selectedGroup = d3.select('.palette')
    .append('div')
    .classed('current', 1);

function updateSelected() {
    let selectedSelection = selectedGroup
        .selectAll('.mice')
        .data(['primary','secondary']);

    selectedSelection
        .enter()
        .append('div')
        .classed('mice', 1)
        .merge(selectedSelection)
        .style('background-color', (d) => drawColor[d]);
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
            drawColor.primary = d;
            updateSelected();
        })
        .on('contextmenu', (d, i) => {
            drawColor.secondary = d;
            updateSelected();
        })
        .merge(colorGroupSelection)
        .style('background-color', (d) => d);
}

updatePalette();
