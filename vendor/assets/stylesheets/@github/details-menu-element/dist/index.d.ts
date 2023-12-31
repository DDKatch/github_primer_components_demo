declare class DetailsMenuElement extends HTMLElement {
    get preload(): boolean;
    set preload(value: boolean);
    get src(): string;
    set src(value: string);
    connectedCallback(): void;
    disconnectedCallback(): void;
}
declare global {
    interface Window {
        DetailsMenuElement: typeof DetailsMenuElement;
    }
    interface HTMLElementTagNameMap {
        'details-menu': DetailsMenuElement;
    }
}
export default DetailsMenuElement;
