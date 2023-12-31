import { Unit } from './duration.js';
declare const HTMLElement: {
    new (): HTMLElement;
    prototype: HTMLElement;
};
export type DeprecatedFormat = 'auto' | 'micro' | 'elapsed';
export type ResolvedFormat = 'duration' | 'relative' | 'datetime';
export type Format = DeprecatedFormat | ResolvedFormat;
export type FormatStyle = 'long' | 'short' | 'narrow';
export type Tense = 'auto' | 'past' | 'future';
export declare class RelativeTimeUpdatedEvent extends Event {
    oldText: string;
    newText: string;
    oldTitle: string;
    newTitle: string;
    constructor(oldText: string, newText: string, oldTitle: string, newTitle: string);
}
export declare class RelativeTimeElement extends HTMLElement implements Intl.DateTimeFormatOptions {
    #private;
    static define(tag?: string, registry?: CustomElementRegistry): typeof RelativeTimeElement;
    static get observedAttributes(): string[];
    get onRelativeTimeUpdated(): ((event: RelativeTimeUpdatedEvent) => void) | null;
    set onRelativeTimeUpdated(listener: ((event: RelativeTimeUpdatedEvent) => void) | null);
    get second(): 'numeric' | '2-digit' | undefined;
    set second(value: 'numeric' | '2-digit' | undefined);
    get minute(): 'numeric' | '2-digit' | undefined;
    set minute(value: 'numeric' | '2-digit' | undefined);
    get hour(): 'numeric' | '2-digit' | undefined;
    set hour(value: 'numeric' | '2-digit' | undefined);
    get weekday(): 'short' | 'long' | 'narrow' | undefined;
    set weekday(value: 'short' | 'long' | 'narrow' | undefined);
    get day(): 'numeric' | '2-digit' | undefined;
    set day(value: 'numeric' | '2-digit' | undefined);
    get month(): 'numeric' | '2-digit' | 'short' | 'long' | 'narrow' | undefined;
    set month(value: 'numeric' | '2-digit' | 'short' | 'long' | 'narrow' | undefined);
    get year(): 'numeric' | '2-digit' | undefined;
    set year(value: 'numeric' | '2-digit' | undefined);
    get timeZoneName(): 'long' | 'short' | 'shortOffset' | 'longOffset' | 'shortGeneric' | 'longGeneric' | undefined;
    set timeZoneName(value: 'long' | 'short' | 'shortOffset' | 'longOffset' | 'shortGeneric' | 'longGeneric' | undefined);
    get prefix(): string;
    set prefix(value: string);
    get threshold(): string;
    set threshold(value: string);
    get tense(): Tense;
    set tense(value: Tense);
    get precision(): Unit;
    set precision(value: Unit);
    get format(): Format;
    set format(value: Format);
    get formatStyle(): FormatStyle;
    set formatStyle(value: FormatStyle);
    get datetime(): string;
    set datetime(value: string);
    get date(): Date | null;
    set date(value: Date | null);
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: unknown, newValue: unknown): void;
    update(): void;
}
export default RelativeTimeElement;
