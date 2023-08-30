declare class ActionBarElement extends HTMLElement {
    #private;
    items: HTMLElement[];
    itemContainer: HTMLElement;
    moreMenu: HTMLElement;
    connectedCallback(): void;
    disconnectedCallback(): void;
    menuItemClick(event: Event): void;
    update(rect?: DOMRect): void;
}
declare global {
    interface Window {
        ActionBarElement: typeof ActionBarElement;
    }
}
export {};
