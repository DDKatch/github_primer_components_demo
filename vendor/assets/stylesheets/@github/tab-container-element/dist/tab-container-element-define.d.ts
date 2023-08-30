import { TabContainerElement } from './tab-container-element.js';
type JSXBase = JSX.IntrinsicElements extends {
    span: unknown;
} ? JSX.IntrinsicElements : Record<string, Record<string, unknown>>;
declare global {
    interface Window {
        TabContainerElement: typeof TabContainerElement;
    }
    interface HTMLElementTagNameMap {
        'tab-container': TabContainerElement;
    }
    namespace JSX {
        interface IntrinsicElements {
            ['tab-container']: JSXBase['span'] & Partial<Omit<TabContainerElement, keyof HTMLElement>>;
        }
    }
}
export default TabContainerElement;
export * from './tab-container-element.js';
