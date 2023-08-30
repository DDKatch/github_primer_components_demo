export function throttle(callback, wait = 0, { start = true, middle = true, once = false } = {}) {
    let innerStart = start;
    let last = 0;
    let timer;
    let cancelled = false;
    function fn(...args) {
        if (cancelled)
            return;
        const delta = Date.now() - last;
        last = Date.now();
        if (start && middle && delta >= wait) {
            innerStart = true;
        }
        if (innerStart) {
            innerStart = false;
            callback.apply(this, args);
            if (once)
                fn.cancel();
        }
        else if ((middle && delta < wait) || !middle) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                last = Date.now();
                callback.apply(this, args);
                if (once)
                    fn.cancel();
            }, !middle ? wait : wait - delta);
        }
    }
    fn.cancel = () => {
        clearTimeout(timer);
        cancelled = true;
    };
    return fn;
}
export function debounce(callback, wait = 0, { start = false, middle = false, once = false } = {}) {
    return throttle(callback, wait, { start, middle, once });
}
