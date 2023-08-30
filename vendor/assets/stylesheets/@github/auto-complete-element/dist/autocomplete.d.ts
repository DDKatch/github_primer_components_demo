import type AutocompleteElement from './auto-complete-element';
import Combobox from '@github/combobox-nav';
export default class Autocomplete {
    container: AutocompleteElement;
    input: HTMLInputElement;
    results: HTMLElement;
    combobox: Combobox;
    feedback: HTMLElement | null;
    autoselectEnabled: boolean;
    clientOptions: NodeListOf<HTMLElement> | null;
    clearButton: HTMLElement | null;
    interactingWithList: boolean;
    constructor(container: AutocompleteElement, input: HTMLInputElement, results: HTMLElement, autoselectEnabled?: boolean);
    destroy(): void;
    handleClear(event: Event): void;
    onKeydown(event: KeyboardEvent): void;
    onInputFocus(): void;
    onInputBlur(): void;
    onCommit({ target }: Pick<Event, 'target'>): void;
    onResultsMouseDown(): void;
    onInputChange(): void;
    identifyOptions(): void;
    updateFeedbackForScreenReaders(inputString: string): void;
    fetchResults(): void;
    open(): void;
    close(): void;
}
