declare class ImageCropElement extends HTMLElement {
    connectedCallback(): void;
    static get observedAttributes(): string[];
    get src(): string | null;
    set src(val: string | null);
    get loaded(): boolean;
    set loaded(val: boolean);
    attributeChangedCallback(attribute: string, oldValue: string, newValue: string): void;
}
declare global {
    interface Window {
        ImageCropElement: typeof ImageCropElement;
    }
    interface HTMLElementTagNameMap {
        'image-crop': ImageCropElement;
    }
}
export default ImageCropElement;
