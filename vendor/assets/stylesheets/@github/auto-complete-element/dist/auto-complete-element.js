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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var _AutoCompleteElement_instances, _AutoCompleteElement_forElement, _AutoCompleteElement_inputElement, _AutoCompleteElement_reattachState, _AutoCompleteElement_requestController;
import Autocomplete from './autocomplete.js';
const HTMLElement = globalThis.HTMLElement || null;
export class AutoCompleteEvent extends Event {
    constructor(type, _a) {
        var { relatedTarget } = _a, init = __rest(_a, ["relatedTarget"]);
        super(type, init);
        this.relatedTarget = relatedTarget;
    }
}
const state = new WeakMap();
let cspTrustedTypesPolicyPromise = null;
export class AutoCompleteElement extends HTMLElement {
    constructor() {
        super(...arguments);
        _AutoCompleteElement_instances.add(this);
        _AutoCompleteElement_forElement.set(this, null);
        _AutoCompleteElement_inputElement.set(this, null);
        _AutoCompleteElement_requestController.set(this, void 0);
    }
    static define(tag = 'auto-complete', registry = customElements) {
        registry.define(tag, this);
        return this;
    }
    static setCSPTrustedTypesPolicy(policy) {
        cspTrustedTypesPolicyPromise = policy === null ? policy : Promise.resolve(policy);
    }
    get forElement() {
        var _a;
        if ((_a = __classPrivateFieldGet(this, _AutoCompleteElement_forElement, "f")) === null || _a === void 0 ? void 0 : _a.isConnected) {
            return __classPrivateFieldGet(this, _AutoCompleteElement_forElement, "f");
        }
        const id = this.getAttribute('for');
        const root = this.getRootNode();
        if (id && (root instanceof Document || root instanceof ShadowRoot)) {
            return root.getElementById(id);
        }
        return null;
    }
    set forElement(element) {
        __classPrivateFieldSet(this, _AutoCompleteElement_forElement, element, "f");
        this.setAttribute('for', '');
    }
    get inputElement() {
        var _a;
        if ((_a = __classPrivateFieldGet(this, _AutoCompleteElement_inputElement, "f")) === null || _a === void 0 ? void 0 : _a.isConnected) {
            return __classPrivateFieldGet(this, _AutoCompleteElement_inputElement, "f");
        }
        return this.querySelector('input');
    }
    set inputElement(input) {
        __classPrivateFieldSet(this, _AutoCompleteElement_inputElement, input, "f");
        __classPrivateFieldGet(this, _AutoCompleteElement_instances, "m", _AutoCompleteElement_reattachState).call(this);
    }
    connectedCallback() {
        if (!this.isConnected)
            return;
        __classPrivateFieldGet(this, _AutoCompleteElement_instances, "m", _AutoCompleteElement_reattachState).call(this);
    }
    disconnectedCallback() {
        const autocomplete = state.get(this);
        if (autocomplete) {
            autocomplete.destroy();
            state.delete(this);
        }
    }
    get src() {
        return this.getAttribute('src') || '';
    }
    set src(url) {
        this.setAttribute('src', url);
    }
    get value() {
        return this.getAttribute('value') || '';
    }
    set value(value) {
        this.setAttribute('value', value);
    }
    get open() {
        return this.hasAttribute('open');
    }
    set open(value) {
        if (value) {
            this.setAttribute('open', '');
        }
        else {
            this.removeAttribute('open');
        }
    }
    get fetchOnEmpty() {
        return this.hasAttribute('fetch-on-empty');
    }
    set fetchOnEmpty(fetchOnEmpty) {
        this.toggleAttribute('fetch-on-empty', fetchOnEmpty);
    }
    async fetchResult(url) {
        var _a;
        (_a = __classPrivateFieldGet(this, _AutoCompleteElement_requestController, "f")) === null || _a === void 0 ? void 0 : _a.abort();
        const { signal } = (__classPrivateFieldSet(this, _AutoCompleteElement_requestController, new AbortController(), "f"));
        const res = await fetch(url.toString(), {
            signal,
            headers: {
                Accept: 'text/fragment+html',
            },
        });
        if (!res.ok) {
            throw new Error(await res.text());
        }
        if (cspTrustedTypesPolicyPromise) {
            const cspTrustedTypesPolicy = await cspTrustedTypesPolicyPromise;
            return cspTrustedTypesPolicy.createHTML(await res.text(), res);
        }
        return await res.text();
    }
    static get observedAttributes() {
        return ['open', 'value', 'for'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        var _a, _b;
        if (oldValue === newValue)
            return;
        const autocomplete = state.get(this);
        if (!autocomplete)
            return;
        if (this.forElement !== ((_a = state.get(this)) === null || _a === void 0 ? void 0 : _a.results) || this.inputElement !== ((_b = state.get(this)) === null || _b === void 0 ? void 0 : _b.input)) {
            __classPrivateFieldGet(this, _AutoCompleteElement_instances, "m", _AutoCompleteElement_reattachState).call(this);
        }
        switch (name) {
            case 'open':
                newValue === null ? autocomplete.close() : autocomplete.open();
                break;
            case 'value':
                if (newValue !== null) {
                    autocomplete.input.value = newValue;
                }
                this.dispatchEvent(new AutoCompleteEvent('auto-complete-change', {
                    bubbles: true,
                    relatedTarget: autocomplete.input,
                }));
                break;
        }
    }
}
_AutoCompleteElement_forElement = new WeakMap(), _AutoCompleteElement_inputElement = new WeakMap(), _AutoCompleteElement_requestController = new WeakMap(), _AutoCompleteElement_instances = new WeakSet(), _AutoCompleteElement_reattachState = function _AutoCompleteElement_reattachState() {
    var _a;
    (_a = state.get(this)) === null || _a === void 0 ? void 0 : _a.destroy();
    const { forElement, inputElement } = this;
    if (!forElement || !inputElement)
        return;
    const autoselectEnabled = this.getAttribute('data-autoselect') === 'true';
    state.set(this, new Autocomplete(this, inputElement, forElement, autoselectEnabled));
    forElement.setAttribute('role', 'listbox');
};
export default AutoCompleteElement;
