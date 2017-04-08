import './css/root.scss';
import './js/socket';
import './js/cursors';
import './js/canvas';

// grr firefox
[...document.querySelectorAll('img')]
    .forEach((node) => {
        node.setAttribute('draggable','false');
        node.addEventListener('dragstart', (e) => {
            e.preventDefault();
        });
    });

document.addEventListener('contextmenu', (e) => e.preventDefault());
