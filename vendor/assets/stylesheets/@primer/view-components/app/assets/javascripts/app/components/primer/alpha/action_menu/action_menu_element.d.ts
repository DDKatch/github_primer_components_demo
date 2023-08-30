import IncludeFragmentElement from '@github/include-fragment-element';
type SelectVariant = 'none' | 'single' | 'multiple' | null;
type SelectedItem = {
    label: string | null | undefined;
    value: string | null | undefined;
    element: Element;
};
export declare class ActionMenuElement extends HTMLElement {
    #private;
    includeFragment: IncludeFragmentElement;
    get selectVariant(): SelectVariant;
    set selectVariant(variant: SelectVariant);
    get dynamicLabelPrefix(): string;
    set dynamicLabelPrefix(value: string);
    get dynamicLabel(): boolean;
    set dynamicLabel(value: boolean);
    get popoverElement(): HTMLElement | null;
    get invokerElement(): HTMLElement | null;
    get invokerLabel(): HTMLElement | null;
    get selectedItems(): SelectedItem[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    handleEvent(event: Event): void;
}
declare global {
    interface Window {
        ActionMenuElement: typeof ActionMenuElement;
    }
}
export {};
