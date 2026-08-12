
/*function addLoadListener(fn)
{
    window.addEventListener('load', fn);
} */
function addLoadListener(fn) {
    if (window.addEventListener) {
        window.addEventListener('load', fn, false);
    } else if (window.attachEvent) {
        window.attachEvent('onload', fn);
    } else {
        const old = window.onload;

        window.onload = (typeof old === 'function')
            ? function () {
                  old();
                  fn();
              }
            : fn;
    }
}