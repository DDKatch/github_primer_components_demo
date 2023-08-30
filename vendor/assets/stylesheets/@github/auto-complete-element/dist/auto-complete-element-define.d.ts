import { AutoCompleteElement } from './auto-complete-element.js';
type JSXBase = JSX.IntrinsicElements extends {
    span: unknown;
} ? JSX.IntrinsicElements : Record<string, Record<string, unknown>>;
declare global {
    interface Window {
        AutoCompleteElement: typeof AutoCompleteElement;
        AutocompleteElement: typeof AutoCompleteElement;
    }
    interface HTMLElementTagNameMap {
        'auto-complete': AutoCompleteElement;
    }
    namespace JSX {
        interface IntrinsicElements {
            ['auto-complete']: JSXBase['span'] & Partial<Omit<AutoCompleteElement, keyof HTMLElement>>;
        }
    }
}
export default AutoCompleteElement;
export * from './auto-complete-element.js';
