import './css/root.scss';

import './js/socket';

// grr firefox
[...document.querySelectorAll('img')]
    .forEach((node) => {
        node.setAttribute('draggable','false');
        node.setAttribute('ondragstart','return false;');
    });

document.addEventListener('contextmenu', (e) => e.preventDefault());