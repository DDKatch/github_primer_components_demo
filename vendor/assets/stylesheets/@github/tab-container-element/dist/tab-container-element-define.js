import { TabContainerElement } from './tab-container-element.js';
const root = (typeof globalThis !== 'undefined' ? globalThis : window);
try {
    root.TabContainerElement = TabContainerElement.define();
}
catch (e) {
    if (!(root.DOMException && e instanceof DOMException && e.name === 'NotSupportedError') &&
        !(e instanceof ReferenceError)) {
        throw e;
    }
}
export default TabContainerElement;
export * from './tab-container-element.js';
