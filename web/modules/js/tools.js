import d3 from '#lib/d3';

// variables

let selectedIndex = 6;

let tools = [
    null, null,
    null, null,
    null, null,
    'PENCIL', 'BRUSH',
];

export let drawTool = {
    get name() {
        return tools[selectedIndex];
    },
    get size() {
        if (drawTool.name == 'BRUSH') {
            return [3,2,1][brushIndex%3];
        }
    },
    get shape() {
        if (drawTool.name == 'BRUSH') {
            return brushIndex < 3 ? 'circle'
                : brushIndex < 6 ? 'rect'
                : brushIndex < 9 ? 'bkLine'
                : 'fwLine';
        }
    },
};

// draw toolbox

let toolbox = d3.select('.toolbox');

let selection = toolbox.selectAll('.tool')
    .data(new Array(16).fill({}));

let enter = selection.enter()
    .append('div')
    .classed('tool', 1)
    .append('div')
    .on('mousedown', selectTool);

enter.append('img')
    .attr('src', (d,i) => `tools/${i==selectedIndex?'down':'up'}.png`);

enter.append('img')
    .attr('src', (d,i) => `tools/${i}.png`);

// change tool... 

function selectTool(d, i) {
    if (selectedIndex == i) return;
    toolbox.select(`.tool:nth-child(${selectedIndex+1})`)
        .select('img')
        .attr('src', 'tools/up.png');
    d3.select(this)
        .select('img')
        .attr('src', 'tools/down.png');
    selectedIndex = i;
    selectSubTool();
}

// subtool

let subTool = toolbox.append('div').classed('subtool', 1);
let subToolSelectedIndex = 0;


function selectSubTool() {
    subTool.html('');

    if (drawTool.name == 'BRUSH') {
        drawBrushSub();
    }
}

// brush

let brushData = [
    // circles
    {r: 3}, {r: 2}, {r: 1},
    // rectangles
    {x: 4, size: 8}, {x: 18, size: 5}, {x: 31, size: 2},
    // lines
    {x1: 4, x2: 12, y1: 42, y2: 34},{x1: 18, x2: 23, y1: 41, y2: 36},{x1: 31, x2: 33, y1: 40, y2: 38},  
    {x2: 4, x1: 12, y1: 57, y2: 49},{x2: 18, x1: 23, y1: 56, y2: 51},{x2: 31, x1: 33, y1: 55, y2: 53},  
];
let brushIndex = 1;

function drawBrushSub() {
    let svg = subTool.select('svg');
    if (!svg.node()) {
        svg = subTool.append('svg');
    }

    let brushSelection = svg.selectAll('.brush')
        .data(brushData);

    brushSelection
        .enter()
        .append('g')
        .classed('brush', 1)
        .each(function(d, i) {
            let subShape, self = d3.select(this);

            self.append('rect')
                .classed('cover', 1)
                .attr('fill', 'transparent')
                .attr('x', ((i%3)*12)+5)
                .attr('y', (15*((i/3)|0))+2)
                .attr('width', 6)
                .attr('height', 12);

            if (i < 3) {
                subShape = self.append('circle')
                    .attr('r', (d) => d.r)
                    .attr('cx', (12*i) + 8)
                    .attr('cy', 8);
            }
            else if (i < 6) {
                subShape = self.append('rect')
                    .attr('x', (d) => d.x)
                    .attr('y', 16 + i)
                    .attr('width', (d) => d.size)
                    .attr('height', (d) => d.size);
            }
            else if (i < 12) {
                subShape = self.append('line')
                    .attr('x1', (d) => d.x1)
                    .attr('x2', (d) => d.x2)
                    .attr('y1', (d) => d.y1)
                    .attr('y2', (d) => d.y2)
                    .style('stroke', 'black')
                    .style('stroke-width', 1);
            }

            subShape
                .classed('shape',1)
                .style('pointer-events', 'none');
        })
        .on('click', (d, i) => {
            brushIndex = i;
            drawBrushSub();
        })
        .merge(brushSelection)
        .each(function(d, i) {
            let self = d3.select(this);
            let cover = self.select('.cover');
            let shape = self.select('.shape');

            let isSelected = brushIndex == i;
            cover.attr('fill', isSelected ? '#008' : 'transparent');
            if (i < 6) {
                shape.attr('fill', isSelected ? 'white' : 'black');
            }
            else {
                shape.style('stroke', isSelected ? 'white' : 'black');
            }
        });

}
