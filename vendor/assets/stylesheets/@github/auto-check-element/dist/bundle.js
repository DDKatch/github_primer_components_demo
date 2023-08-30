var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// node_modules/@github/mini-throttle/dist/index.js
function throttle(callback, wait = 0, { start = true, middle = true, once = false } = {}) {
  let last = 0;
  let timer;
  let cancelled = false;
  function fn(...args) {
    if (cancelled)
      return;
    const delta = Date.now() - last;
    last = Date.now();
    if (start) {
      start = false;
      callback.apply(this, args);
      if (once)
        fn.cancel();
    } else if (middle && delta < wait || !middle) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        last = Date.now();
        callback.apply(this, args);
        if (once)
          fn.cancel();
      }, !middle ? wait : wait - delta);
    }
  }
  __name(fn, "fn");
  fn.cancel = () => {
    clearTimeout(timer);
    cancelled = true;
  };
  return fn;
}
__name(throttle, "throttle");
function debounce(callback, wait = 0, { start = false, middle = false, once = false } = {}) {
  return throttle(callback, wait, { start, middle, once });
}
__name(debounce, "debounce");

// dist/auto-check-element.js
var __classPrivateFieldGet = function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = function(receiver, state, value, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var _AutoCheckElement_onloadend;
var states = /* @__PURE__ */ new WeakMap();
var AutoCheckEvent = class extends Event {
  constructor(phase) {
    super(`auto-check-${phase}`, { bubbles: true });
    this.phase = phase;
  }
  get detail() {
    return this;
  }
};
__name(AutoCheckEvent, "AutoCheckEvent");
var AutoCheckValidationEvent = class extends AutoCheckEvent {
  constructor(phase, message = "") {
    super(phase);
    this.phase = phase;
    this.message = message;
    this.setValidity = (message2) => {
      this.message = message2;
    };
  }
};
__name(AutoCheckValidationEvent, "AutoCheckValidationEvent");
var AutoCheckCompleteEvent = class extends AutoCheckEvent {
  constructor() {
    super("complete");
  }
};
__name(AutoCheckCompleteEvent, "AutoCheckCompleteEvent");
var AutoCheckSuccessEvent = class extends AutoCheckEvent {
  constructor(response) {
    super("success");
    this.response = response;
  }
};
__name(AutoCheckSuccessEvent, "AutoCheckSuccessEvent");
var AutoCheckStartEvent = class extends AutoCheckValidationEvent {
  constructor() {
    super("start", "Verifying\u2026");
  }
};
__name(AutoCheckStartEvent, "AutoCheckStartEvent");
var AutoCheckErrorEvent = class extends AutoCheckValidationEvent {
  constructor(response) {
    super("error", "Validation failed");
    this.response = response;
  }
};
__name(AutoCheckErrorEvent, "AutoCheckErrorEvent");
var AutoCheckSendEvent = class extends AutoCheckEvent {
  constructor(body) {
    super("send");
    this.body = body;
  }
};
__name(AutoCheckSendEvent, "AutoCheckSendEvent");
var AutoCheckElement = class extends HTMLElement {
  constructor() {
    super(...arguments);
    _AutoCheckElement_onloadend.set(this, null);
  }
  static define(tag = "auto-check", registry = customElements) {
    registry.define(tag, this);
    return this;
  }
  get onloadend() {
    return __classPrivateFieldGet(this, _AutoCheckElement_onloadend, "f");
  }
  set onloadend(listener) {
    if (__classPrivateFieldGet(this, _AutoCheckElement_onloadend, "f")) {
      this.removeEventListener("loadend", __classPrivateFieldGet(this, _AutoCheckElement_onloadend, "f"));
    }
    __classPrivateFieldSet(this, _AutoCheckElement_onloadend, typeof listener === "object" || typeof listener === "function" ? listener : null, "f");
    if (typeof listener === "function") {
      this.addEventListener("loadend", listener);
    }
  }
  connectedCallback() {
    const input = this.input;
    if (!input)
      return;
    const checker = debounce(check.bind(null, this), 300);
    const state = { check: checker, controller: null };
    states.set(this, state);
    input.addEventListener("input", setLoadingState);
    input.addEventListener("input", checker);
    input.autocomplete = "off";
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
    input.removeEventListener("input", setLoadingState);
    input.removeEventListener("input", state.check);
    input.setCustomValidity("");
  }
  attributeChangedCallback(name) {
    if (name === "required") {
      const input = this.input;
      if (!input)
        return;
      input.required = this.required;
    }
  }
  static get observedAttributes() {
    return ["required"];
  }
  get input() {
    return this.querySelector("input");
  }
  get src() {
    const src = this.getAttribute("src");
    if (!src)
      return "";
    const link = this.ownerDocument.createElement("a");
    link.href = src;
    return link.href;
  }
  set src(value) {
    this.setAttribute("src", value);
  }
  get csrf() {
    const csrfElement = this.querySelector("[data-csrf]");
    return this.getAttribute("csrf") || csrfElement instanceof HTMLInputElement && csrfElement.value || "";
  }
  set csrf(value) {
    this.setAttribute("csrf", value);
  }
  get required() {
    return this.hasAttribute("required");
  }
  set required(required) {
    if (required) {
      this.setAttribute("required", "");
    } else {
      this.removeAttribute("required");
    }
  }
  get csrfField() {
    return this.getAttribute("csrf-field") || "authenticity_token";
  }
  set csrfField(value) {
    this.setAttribute("csrf-field", value);
  }
};
__name(AutoCheckElement, "AutoCheckElement");
_AutoCheckElement_onloadend = /* @__PURE__ */ new WeakMap();
function setLoadingState(event) {
  const input = event.currentTarget;
  if (!(input instanceof HTMLInputElement))
    return;
  const autoCheckElement = input.closest("auto-check");
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
__name(setLoadingState, "setLoadingState");
function makeAbortController() {
  if ("AbortController" in window) {
    return new AbortController();
  }
  return {
    signal: null,
    abort() {
    }
  };
}
__name(makeAbortController, "makeAbortController");
async function fetchWithNetworkEvents(el, url, options) {
  try {
    const response = await fetch(url, options);
    el.dispatchEvent(new Event("load"));
    el.dispatchEvent(new Event("loadend"));
    return response;
  } catch (error) {
    if (error.name !== "AbortError") {
      el.dispatchEvent(new Event("error"));
      el.dispatchEvent(new Event("loadend"));
    }
    throw error;
  }
}
__name(fetchWithNetworkEvents, "fetchWithNetworkEvents");
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
      input.setCustomValidity("");
    }
    return;
  }
  if (!input.value.trim()) {
    if (autoCheckElement.required) {
      input.setCustomValidity("");
    }
    return;
  }
  const body = new FormData();
  body.append(csrfField, csrf);
  body.append("value", input.value);
  input.dispatchEvent(new AutoCheckSendEvent(body));
  if (state.controller) {
    state.controller.abort();
  } else {
    autoCheckElement.dispatchEvent(new Event("loadstart"));
  }
  state.controller = makeAbortController();
  try {
    const response = await fetchWithNetworkEvents(autoCheckElement, src, {
      credentials: "same-origin",
      signal: state.controller.signal,
      method: "POST",
      body
    });
    if (response.ok) {
      if (autoCheckElement.required) {
        input.setCustomValidity("");
      }
      input.dispatchEvent(new AutoCheckSuccessEvent(response.clone()));
    } else {
      const event = new AutoCheckErrorEvent(response.clone());
      input.dispatchEvent(event);
      if (autoCheckElement.required) {
        input.setCustomValidity(event.message);
      }
    }
    state.controller = null;
    input.dispatchEvent(new AutoCheckCompleteEvent());
  } catch (error) {
    if (error.name !== "AbortError") {
      state.controller = null;
      input.dispatchEvent(new AutoCheckCompleteEvent());
    }
  }
}
__name(check, "check");

// dist/auto-check-element-define.js
var root = typeof globalThis !== "undefined" ? globalThis : window;
try {
  root.AutoCheckElement = AutoCheckElement.define();
} catch (e) {
  if (!(root.DOMException && e instanceof DOMException && e.name === "NotSupportedError") && !(e instanceof ReferenceError)) {
    throw e;
  }
}

// dist/index.js
var dist_default = AutoCheckElement;
export {
  AutoCheckCompleteEvent,
  AutoCheckElement,
  AutoCheckErrorEvent,
  AutoCheckSendEvent,
  AutoCheckStartEvent,
  AutoCheckSuccessEvent,
  dist_default as default
};
