import { AutoCheckElement } from './auto-check-element.js';
type JSXBase = JSX.IntrinsicElements extends {
    span: unknown;
} ? JSX.IntrinsicElements : Record<string, Record<string, unknown>>;
declare global {
    interface Window {
        AutoCheckElement: typeof AutoCheckElement;
    }
    interface HTMLElementTagNameMap {
        'auto-check': AutoCheckElement;
    }
    namespace JSX {
        interface IntrinsicElements {
            ['auto-check']: JSXBase['span'] & Partial<Omit<AutoCheckElement, keyof HTMLElement>>;
        }
    }
}
export default AutoCheckElement;
export * from './auto-check-element.js';
