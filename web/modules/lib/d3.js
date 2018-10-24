// d3-drag was forked to remove preventDefault()

const d3 = {
    // ...require('d3-array'),
    // ...require('d3-axis'),
    // ...require('d3-brush'),
    // ...require('d3-chord'),
    // ...require('d3-collection'),
    // ...require('d3-color'),
    ...require('d3-dispatch'),
    ...require('./d3-drag'),
    // ...require('d3-dsv'),
    // ...require('d3-ease'),
    // ...require('d3-force'),
    // ...require('d3-format'),
    // ...require('d3-geo'),
    // ...require('d3-hierarchy'),
    // ...require('d3-interpolate'),
    // ...require('d3-path'),
    // ...require('d3-polygon'),
    // ...require('d3-quadtree'),
    // ...require('d3-queue'),
    // ...require('d3-random'),
    // ...require('d3-request'),
    // ...require('d3-scale'),
    ...require('d3-selection'),
    // ...require('d3-shape'),
    // ...require('d3-time'),
    // ...require('d3-time-format'),
    // ...require('d3-timer'),
    // ...require('d3-transition'),
    // ...require('d3-voronoi'),
    // ...require('d3-zoom')
};

// patch export with d3.event workaround

const d3Selection = require('d3-selection');

Object.defineProperty(d3, 'event', {
    get: function () {
        return d3Selection.event;
    },
});

export default d3;
