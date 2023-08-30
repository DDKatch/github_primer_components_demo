export interface ToggleInit extends EventInit {
    oldState: string;
    newState: string;
}
export declare class ToggleEvent extends Event {
    oldState: string;
    newState: string;
    constructor(type: string, { oldState, newState, ...init }?: Partial<ToggleInit>);
}
export declare function queuePopoverToggleEventTask(element: HTMLElement, oldState: string, newState: string): void;
