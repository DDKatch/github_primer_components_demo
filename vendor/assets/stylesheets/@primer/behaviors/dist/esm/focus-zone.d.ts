export declare type Direction = 'previous' | 'next' | 'start' | 'end';
export declare type FocusMovementKeys = 'ArrowLeft' | 'ArrowDown' | 'ArrowUp' | 'ArrowRight' | 'h' | 'j' | 'k' | 'l' | 'a' | 's' | 'w' | 'd' | 'Tab' | 'Home' | 'End' | 'PageUp' | 'PageDown' | 'Backspace';
export declare enum FocusKeys {
    ArrowHorizontal = 1,
    ArrowVertical = 2,
    JK = 4,
    HL = 8,
    HomeAndEnd = 16,
    PageUpDown = 256,
    WS = 32,
    AD = 64,
    Tab = 128,
    Backspace = 512,
    ArrowAll = 3,
    HJKL = 12,
    WASD = 96,
    All = 511
}
export interface FocusZoneSettings {
    focusOutBehavior?: 'stop' | 'wrap';
    getNextFocusable?: (direction: Direction, from: Element | undefined, event: KeyboardEvent) => HTMLElement | undefined;
    focusableElementFilter?: (element: HTMLElement) => boolean;
    bindKeys?: FocusKeys;
    abortSignal?: AbortSignal;
    activeDescendantControl?: HTMLElement;
    onActiveDescendantChanged?: (newActiveDescendant: HTMLElement | undefined, previousActiveDescendant: HTMLElement | undefined, directlyActivated: boolean) => void;
    focusInStrategy?: 'first' | 'closest' | 'previous' | ((previousFocusedElement: Element) => HTMLElement | undefined);
    preventScroll?: boolean;
}
export declare const isActiveDescendantAttribute = "data-is-active-descendant";
export declare const activeDescendantActivatedDirectly = "activated-directly";
export declare const activeDescendantActivatedIndirectly = "activated-indirectly";
export declare const hasActiveDescendantAttribute = "data-has-active-descendant";
export declare function focusZone(container: HTMLElement, settings?: FocusZoneSettings): AbortController;
