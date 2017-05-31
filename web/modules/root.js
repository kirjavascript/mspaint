
                              //_       __                      _
   //___ ___  _________  ____ _(_)___  / /_
  // __ `__ \/ ___/ __ \/ __ `/ / __ \/ __/
 // / / / / (__  ) /_/ / /_/ / / / / / /_/
//_/ /_/ /_/____/ .___/\__,_/_/_/ /_/\___/
              //_/

import '#css/root.scss';
import '#js/socket';
import '#js/cursors';
import '#js/workspace';
import '#js/tools';
import '#js/statusbar';
import '#js/palette';
import '#js/scrollbars';

// Browser Hacks //

// disable contextmenu
document.addEventListener('contextmenu', (e) => e.preventDefault());

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

// snap height to innerHeight on chrome mobile
let ua = navigator.userAgent.toLowerCase();
if (~ua.indexOf('chrome') && ~ua.indexOf('mobile')) {
    const container = document.querySelector('.window');
    const resize = () => {
        document.body.style.height = window.innerHeight + 'px';
        container.style.height = window.innerHeight + 'px';
    };
    resize();
    window.addEventListener('resize', resize);
}
