export interface CustomElement extends HTMLElement {
    connectedCallback?(): void;
    attributeChangedCallback?(name: string, oldValue: string | null, newValue: string | null): void;
    disconnectedCallback?(): void;
    adoptedCallback?(): void;
    formAssociatedCallback?(form: HTMLFormElement): void;
    formDisabledCallback?(disabled: boolean): void;
    formResetCallback?(): void;
    formStateRestoreCallback?(state: unknown, reason: 'autocomplete' | 'restore'): void;
}
export interface CustomElementClass {
    new (...args: any[]): CustomElement;
    observedAttributes?: string[];
    disabledFeatures?: string[];
    formAssociated?: boolean;
    attrPrefix?: string;
}
//# sourceMappingURL=custom-element.d.ts.map