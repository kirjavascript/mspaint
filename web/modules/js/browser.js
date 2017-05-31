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
