export declare const visibilityState: WeakMap<HTMLElement, "hidden" | "showing">;
export declare function popoverTargetAttributeActivationBehavior(element: HTMLButtonElement | HTMLInputElement): void;
export declare function getRootNode(node: Node): Node;
export declare function showPopover(element: HTMLElement): void;
export declare function hidePopover(element: HTMLElement, focusPreviousElement?: boolean, fireEvents?: boolean): void;
export declare function hideAllPopoversUntil(endpoint: Element | Document, focusPreviousElement: boolean, fireEvents: boolean): void;
export declare function lightDismissOpenPopovers(event: Event): void;
