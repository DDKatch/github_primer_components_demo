export declare type AnchorAlignment = 'start' | 'center' | 'end';
export declare type AnchorSide = 'inside-top' | 'inside-bottom' | 'inside-left' | 'inside-right' | 'inside-center' | 'outside-top' | 'outside-bottom' | 'outside-left' | 'outside-right';
export interface PositionSettings {
    side: AnchorSide;
    align: AnchorAlignment;
    anchorOffset: number;
    alignmentOffset: number;
    allowOutOfBounds: boolean;
}
export interface AnchorPosition {
    top: number;
    left: number;
    anchorSide: AnchorSide;
    anchorAlign: AnchorAlignment;
}
export declare function getAnchoredPosition(floatingElement: Element, anchorElement: Element | DOMRect, settings?: Partial<PositionSettings>): AnchorPosition;
