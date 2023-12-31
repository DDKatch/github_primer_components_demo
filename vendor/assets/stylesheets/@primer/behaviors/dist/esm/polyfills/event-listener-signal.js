let signalSupported = false;
function noop() { }
try {
    const options = Object.create({}, {
        signal: {
            get() {
                signalSupported = true;
            }
        }
    });
    window.addEventListener('test', noop, options);
    window.removeEventListener('test', noop, options);
}
catch (e) {
}
function featureSupported() {
    return signalSupported;
}
function monkeyPatch() {
    if (typeof window === 'undefined') {
        return;
    }
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (name, originalCallback, optionsOrCapture) {
        if (typeof optionsOrCapture === 'object' &&
            'signal' in optionsOrCapture &&
            optionsOrCapture.signal instanceof AbortSignal) {
            originalAddEventListener.call(optionsOrCapture.signal, 'abort', () => {
                this.removeEventListener(name, originalCallback, optionsOrCapture);
            });
        }
        return originalAddEventListener.call(this, name, originalCallback, optionsOrCapture);
    };
}
export function polyfill() {
    if (!featureSupported()) {
        monkeyPatch();
        signalSupported = true;
    }
}
