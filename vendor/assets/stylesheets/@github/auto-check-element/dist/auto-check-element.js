var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _AutoCheckElement_onloadend;
import { debounce } from '@github/mini-throttle';
const states = new WeakMap();
class AutoCheckEvent extends Event {
    constructor(phase) {
        super(`auto-check-${phase}`, { bubbles: true });
        this.phase = phase;
    }
    get detail() {
        return this;
    }
}
class AutoCheckValidationEvent extends AutoCheckEvent {
    constructor(phase, message = '') {
        super(phase);
        this.phase = phase;
        this.message = message;
        this.setValidity = (message) => {
            this.message = message;
        };
    }
}
export class AutoCheckCompleteEvent extends AutoCheckEvent {
    constructor() {
        super('complete');
    }
}
export class AutoCheckSuccessEvent extends AutoCheckEvent {
    constructor(response) {
        super('success');
        this.response = response;
    }
}
export class AutoCheckStartEvent extends AutoCheckValidationEvent {
    constructor() {
        super('start', 'Verifying…');
    }
}
export class AutoCheckErrorEvent extends AutoCheckValidationEvent {
    constructor(response) {
        super('error', 'Validation failed');
        this.response = response;
    }
}
export class AutoCheckSendEvent extends AutoCheckEvent {
    constructor(body) {
        super('send');
        this.body = body;
    }
}
export class AutoCheckElement extends HTMLElement {
    constructor() {
        super(...arguments);
        _AutoCheckElement_onloadend.set(this, null);
    }
    static define(tag = 'auto-check', registry = customElements) {
        registry.define(tag, this);
        return this;
    }
    get onloadend() {
        return __classPrivateFieldGet(this, _AutoCheckElement_onloadend, "f");
    }
    set onloadend(listener) {
        if (__classPrivateFieldGet(this, _AutoCheckElement_onloadend, "f")) {
            this.removeEventListener('loadend', __classPrivateFieldGet(this, _AutoCheckElement_onloadend, "f"));
        }
        __classPrivateFieldSet(this, _AutoCheckElement_onloadend, typeof listener === 'object' || typeof listener === 'function' ? listener : null, "f");
        if (typeof listener === 'function') {
            this.addEventListener('loadend', listener);
        }
    }
    connectedCallback() {
        const input = this.input;
        if (!input)
            return;
        const checker = debounce(check.bind(null, this), 300);
        const state = { check: checker, controller: null };
        states.set(this, state);
        input.addEventListener('input', setLoadingState);
        input.addEventListener('input', checker);
        input.autocomplete = 'off';
        input.spellcheck = false;
    }
    disconnectedCallback() {
        const input = this.input;
        if (!input)
            return;
        const state = states.get(this);
        if (!state)
            return;
        states.delete(this);
        input.removeEventListener('input', setLoadingState);
        input.removeEventListener('input', state.check);
        input.setCustomValidity('');
    }
    attributeChangedCallback(name) {
        if (name === 'required') {
            const input = this.input;
            if (!input)
                return;
            input.required = this.required;
        }
    }
    static get observedAttributes() {
        return ['required'];
    }
    get input() {
        return this.querySelector('input');
    }
    get src() {
        const src = this.getAttribute('src');
        if (!src)
            return '';
        const link = this.ownerDocument.createElement('a');
        link.href = src;
        return link.href;
    }
    set src(value) {
        this.setAttribute('src', value);
    }
    get csrf() {
        const csrfElement = this.querySelector('[data-csrf]');
        return this.getAttribute('csrf') || (csrfElement instanceof HTMLInputElement && csrfElement.value) || '';
    }
    set csrf(value) {
        this.setAttribute('csrf', value);
    }
    get required() {
        return this.hasAttribute('required');
    }
    set required(required) {
        if (required) {
            this.setAttribute('required', '');
        }
        else {
            this.removeAttribute('required');
        }
    }
    get csrfField() {
        return this.getAttribute('csrf-field') || 'authenticity_token';
    }
    set csrfField(value) {
        this.setAttribute('csrf-field', value);
    }
}
_AutoCheckElement_onloadend = new WeakMap();
function setLoadingState(event) {
    const input = event.currentTarget;
    if (!(input instanceof HTMLInputElement))
        return;
    const autoCheckElement = input.closest('auto-check');
    if (!(autoCheckElement instanceof AutoCheckElement))
        return;
    const src = autoCheckElement.src;
    const csrf = autoCheckElement.csrf;
    const state = states.get(autoCheckElement);
    if (!src || !csrf || !state) {
        return;
    }
    const startEvent = new AutoCheckStartEvent();
    input.dispatchEvent(startEvent);
    if (autoCheckElement.required) {
        input.setCustomValidity(startEvent.message);
    }
}
function makeAbortController() {
    if ('AbortController' in window) {
        return new AbortController();
    }
    return {
        signal: null,
        abort() {
        },
    };
}
async function fetchWithNetworkEvents(el, url, options) {
    try {
        const response = await fetch(url, options);
        el.dispatchEvent(new Event('load'));
        el.dispatchEvent(new Event('loadend'));
        return response;
    }
    catch (error) {
        if (error.name !== 'AbortError') {
            el.dispatchEvent(new Event('error'));
            el.dispatchEvent(new Event('loadend'));
        }
        throw error;
    }
}
async function check(autoCheckElement) {
    const input = autoCheckElement.input;
    if (!input) {
        return;
    }
    const csrfField = autoCheckElement.csrfField;
    const src = autoCheckElement.src;
    const csrf = autoCheckElement.csrf;
    const state = states.get(autoCheckElement);
    if (!src || !csrf || !state) {
        if (autoCheckElement.required) {
            input.setCustomValidity('');
        }
        return;
    }
    if (!input.value.trim()) {
        if (autoCheckElement.required) {
            input.setCustomValidity('');
        }
        return;
    }
    const body = new FormData();
    body.append(csrfField, csrf);
    body.append('value', input.value);
    input.dispatchEvent(new AutoCheckSendEvent(body));
    if (state.controller) {
        state.controller.abort();
    }
    else {
        autoCheckElement.dispatchEvent(new Event('loadstart'));
    }
    state.controller = makeAbortController();
    try {
        const response = await fetchWithNetworkEvents(autoCheckElement, src, {
            credentials: 'same-origin',
            signal: state.controller.signal,
            method: 'POST',
            body,
        });
        if (response.ok) {
            if (autoCheckElement.required) {
                input.setCustomValidity('');
            }
            input.dispatchEvent(new AutoCheckSuccessEvent(response.clone()));
        }
        else {
            const event = new AutoCheckErrorEvent(response.clone());
            input.dispatchEvent(event);
            if (autoCheckElement.required) {
                input.setCustomValidity(event.message);
            }
        }
        state.controller = null;
        input.dispatchEvent(new AutoCheckCompleteEvent());
    }
    catch (error) {
        if (error.name !== 'AbortError') {
            state.controller = null;
            input.dispatchEvent(new AutoCheckCompleteEvent());
        }
    }
}
export default AutoCheckElement;
