declare const HTMLElement: {
    new (): HTMLElement;
    prototype: HTMLElement;
};
type AutoCompleteEventInit = EventInit & {
    relatedTarget: HTMLInputElement;
};
export declare class AutoCompleteEvent extends Event {
    relatedTarget: HTMLInputElement;
    constructor(type: 'auto-complete-change', { relatedTarget, ...init }: AutoCompleteEventInit);
}
export interface CSPTrustedTypesPolicy {
    createHTML: (s: string, response: Response) => CSPTrustedHTMLToStringable;
}
interface CSPTrustedHTMLToStringable {
    toString: () => string;
}
export declare class AutoCompleteElement extends HTMLElement {
    #private;
    static define(tag?: string, registry?: CustomElementRegistry): typeof AutoCompleteElement;
    static setCSPTrustedTypesPolicy(policy: CSPTrustedTypesPolicy | Promise<CSPTrustedTypesPolicy> | null): void;
    get forElement(): HTMLElement | null;
    set forElement(element: HTMLElement | null);
    get inputElement(): HTMLInputElement | null;
    set inputElement(input: HTMLInputElement | null);
    connectedCallback(): void;
    disconnectedCallback(): void;
    get src(): string;
    set src(url: string);
    get value(): string;
    set value(value: string);
    get open(): boolean;
    set open(value: boolean);
    get fetchOnEmpty(): boolean;
    set fetchOnEmpty(fetchOnEmpty: boolean);
    fetchResult(url: URL): Promise<string | CSPTrustedHTMLToStringable>;
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
}
export default AutoCompleteElement;
