export interface IterateFocusableElements {
    reverse?: boolean;
    strict?: boolean;
    onlyTabbable?: boolean;
}
export declare function iterateFocusableElements(container: HTMLElement, options?: IterateFocusableElements): Generator<HTMLElement, undefined, undefined>;
export declare function getFocusableChild(container: HTMLElement, lastChild?: boolean): HTMLElement | undefined;
export declare function isFocusable(elem: HTMLElement, strict?: boolean): boolean;
export declare function isTabbable(elem: HTMLElement, strict?: boolean): boolean;
