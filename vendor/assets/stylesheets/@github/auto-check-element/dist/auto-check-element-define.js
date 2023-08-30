import { AutoCheckElement } from './auto-check-element.js';
const root = (typeof globalThis !== 'undefined' ? globalThis : window);
try {
    root.AutoCheckElement = AutoCheckElement.define();
}
catch (e) {
    if (!(root.DOMException && e instanceof DOMException && e.name === 'NotSupportedError') &&
        !(e instanceof ReferenceError)) {
        throw e;
    }
}
export default AutoCheckElement;
export * from './auto-check-element.js';
