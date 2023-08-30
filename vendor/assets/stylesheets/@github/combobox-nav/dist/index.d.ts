export declare type ComboboxSettings = {
    tabInsertsSuggestions?: boolean;
    defaultFirstOption?: boolean;
};
export default class Combobox {
    isComposing: boolean;
    list: HTMLElement;
    input: HTMLTextAreaElement | HTMLInputElement;
    keyboardEventHandler: (event: KeyboardEvent) => void;
    compositionEventHandler: (event: Event) => void;
    inputHandler: (event: Event) => void;
    ctrlBindings: boolean;
    tabInsertsSuggestions: boolean;
    defaultFirstOption: boolean;
    constructor(input: HTMLTextAreaElement | HTMLInputElement, list: HTMLElement, { tabInsertsSuggestions, defaultFirstOption }?: ComboboxSettings);
    destroy(): void;
    start(): void;
    stop(): void;
    indicateDefaultOption(): void;
    navigate(indexDiff?: -1 | 1): void;
    clearSelection(): void;
}
