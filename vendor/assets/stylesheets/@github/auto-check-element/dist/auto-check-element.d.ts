declare class AutoCheckEvent extends Event {
    readonly phase: string;
    constructor(phase: string);
    get detail(): this;
}
declare class AutoCheckValidationEvent extends AutoCheckEvent {
    readonly phase: string;
    message: string;
    constructor(phase: string, message?: string);
    setValidity: (message: string) => void;
}
export declare class AutoCheckCompleteEvent extends AutoCheckEvent {
    constructor();
}
export declare class AutoCheckSuccessEvent extends AutoCheckEvent {
    readonly response: Response;
    constructor(response: Response);
}
export declare class AutoCheckStartEvent extends AutoCheckValidationEvent {
    constructor();
}
export declare class AutoCheckErrorEvent extends AutoCheckValidationEvent {
    readonly response: Response;
    constructor(response: Response);
}
export declare class AutoCheckSendEvent extends AutoCheckEvent {
    readonly body: FormData;
    constructor(body: FormData);
}
export declare class AutoCheckElement extends HTMLElement {
    #private;
    static define(tag?: string, registry?: CustomElementRegistry): typeof AutoCheckElement;
    get onloadend(): ((event: Event) => void) | null;
    set onloadend(listener: ((event: Event) => void) | null);
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string): void;
    static get observedAttributes(): string[];
    get input(): HTMLInputElement | null;
    get src(): string;
    set src(value: string);
    get csrf(): string;
    set csrf(value: string);
    get required(): boolean;
    set required(required: boolean);
    get csrfField(): string;
    set csrfField(value: string);
}
export default AutoCheckElement;
