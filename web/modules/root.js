
                              //_       __
   //___ ___  _________  ____ _(_)___  / /_
  // __ `__ \/ ___/ __ \/ __ `/ / __ \/ __/
 // / / / / (__  ) /_/ / /_/ / / / / / /_/
//_/ /_/ /_/____/ .___/\__,_/_/_/ /_/\___/
              //_/


(() => {

    require('#css/root.scss');
    require('#js/socket');
    require('#workspace/index');
    require('#ui/index');
    require('#js/browser');

}) ::function() {

    // load polyfill in bad browsers
    // TODO: replace with polyfill.io & list
    if (!Array.from || !Array.prototype.fill) {
        console.warn('Old browser; installing polyfills');
        let polyfill = document.createElement('script');
        polyfill.onload = this;
        polyfill.src = '//cdn.rawgit.com/inexorabletash/polyfill/v0.1.33/polyfill.min.js';
        document.head.appendChild(polyfill);
    }
    else {
        this();
    }

} ();

