import { AutoCompleteElement } from './auto-complete-element.js';
const root = (typeof globalThis !== 'undefined' ? globalThis : window);
try {
    root.AutocompleteElement = root.AutoCompleteElement = AutoCompleteElement.define();
}
catch (e) {
    if (!(root.DOMException && e instanceof DOMException && e.name === 'NotSupportedError') &&
        !(e instanceof ReferenceError)) {
        throw e;
    }
}
export default AutoCompleteElement;
export * from './auto-complete-element.js';
