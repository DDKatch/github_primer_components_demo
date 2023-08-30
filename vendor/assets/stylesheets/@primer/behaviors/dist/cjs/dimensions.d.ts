declare type Dimensions = {
    top: number;
    left: number;
    bottom: number;
    right: number;
    height?: number;
    width?: number;
};
declare type Offset = {
    top: number;
    left: number;
};
export declare function offset(element: HTMLElement): Offset;
export declare function overflowParent(targetElement: HTMLElement): HTMLElement | null | undefined;
export declare function overflowOffset(element: HTMLElement, targetContainer: Document | HTMLElement | null): Dimensions | undefined;
export declare function positionedOffset(targetElement: HTMLElement, container: HTMLElement | Document | Window | null): (Dimensions & {
    _container: HTMLElement;
}) | undefined;
export {};
