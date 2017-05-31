
                              //_       __
   //___ ___  _________  ____ _(_)___  / /_
  // __ `__ \/ ___/ __ \/ __ `/ / __ \/ __/
 // / / / / (__  ) /_/ / /_/ / / / / / /_/
//_/ /_/ /_/____/ .___/\__,_/_/_/ /_/\___/
              //_/

// load polyfill in bad browsers

if (!Array.from || !Array.prototype.fill) {
    console.warn('Old browser; installing polyfills');
    let polyfill = document.createElement('script');
    polyfill.onload = init;
    polyfill.src = '//cdn.rawgit.com/inexorabletash/polyfill/v0.1.33/polyfill.min.js';
    document.head.appendChild(polyfill);
}
else {
    init();
}

function init() {
    require('#css/root.scss');
    require('#js/socket');
    require('#js/cursors');
    require('#js/workspace');
    require('#js/tools');
    require('#js/statusbar');
    require('#js/palette');
    require('#js/scrollbars');

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

    // snap height to innerHeight on chrome mobile / iOS
    let ua = navigator.userAgent.toLowerCase();
    if (
        (~ua.indexOf('mobile') && ~ua.indexOf('chrome'))
        || ~ua.indexOf('iphone')
        || ~ua.indexOf('ipad')
    ) {
        const container = document.querySelector('.window');
        const resize = () => {
            document.body.style.height = window.innerHeight + 'px';
            container.style.height = window.innerHeight + 'px';
        };
        resize();
        window.addEventListener('resize', resize);
    }
}

