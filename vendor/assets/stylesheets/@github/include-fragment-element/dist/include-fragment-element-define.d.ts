import { IncludeFragmentElement } from './include-fragment-element.js';
type JSXBase = JSX.IntrinsicElements extends {
    span: unknown;
} ? JSX.IntrinsicElements : Record<string, Record<string, unknown>>;
declare global {
    interface Window {
        IncludeFragmentElement: typeof IncludeFragmentElement;
    }
    interface HTMLElementTagNameMap {
        'include-fragment': IncludeFragmentElement;
    }
    namespace JSX {
        interface IntrinsicElements {
            ['include-fragment']: JSXBase['span'] & Partial<Omit<IncludeFragmentElement, keyof HTMLElement>>;
        }
    }
}
export default IncludeFragmentElement;
export * from './include-fragment-element.js';
