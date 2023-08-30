import { IncludeFragmentElement } from './include-fragment-element.js';
const root = (typeof globalThis !== 'undefined' ? globalThis : window);
try {
    root.IncludeFragmentElement = IncludeFragmentElement.define();
}
catch (e) {
    if (!(root.DOMException && e instanceof DOMException && e.name === 'NotSupportedError') &&
        !(e instanceof ReferenceError)) {
        throw e;
    }
}
export default IncludeFragmentElement;
export * from './include-fragment-element.js';
