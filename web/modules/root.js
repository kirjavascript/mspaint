import '#css/root.scss';
import '#js/socket';
import '#js/cursors';
import '#js/workspace';
import '#js/tools';
import '#js/statusbar';
import '#js/palette';
import '#js/scrollbars';

// disable image dragging in firefox
[...document.querySelectorAll('img')]
    .forEach((node) => {
        node.setAttribute('draggable','false');
        node.addEventListener('dragstart', (e) => {
            e.preventDefault();
        });
    });

// disable elastic scroll in iOS
document.body.addEventListener('touchmove', (e) => {
    e.preventDefault();
});

document.addEventListener('contextmenu', (e) => e.preventDefault());
