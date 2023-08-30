interface CSPTrustedTypesPolicy {
    createHTML: (s: string, response: Response) => CSPTrustedHTMLToStringable;
}
interface CSPTrustedHTMLToStringable {
    toString: () => string;
}
export declare class IncludeFragmentElement extends HTMLElement {
    #private;
    static define(tag?: string, registry?: CustomElementRegistry): typeof IncludeFragmentElement;
    static setCSPTrustedTypesPolicy(policy: CSPTrustedTypesPolicy | Promise<CSPTrustedTypesPolicy> | null): void;
    static get observedAttributes(): string[];
    get src(): string;
    set src(val: string);
    get loading(): 'eager' | 'lazy';
    set loading(value: 'eager' | 'lazy');
    get accept(): string;
    set accept(val: string);
    get data(): Promise<string>;
    attributeChangedCallback(attribute: string, oldVal: string | null): void;
    connectedCallback(): void;
    request(): Request;
    load(): Promise<string>;
    fetch(request: RequestInfo): Promise<Response>;
    refetch(): void;
}
export {};
