var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// dist/include-fragment-element.js
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
var _IncludeFragmentElement_instances;
var _IncludeFragmentElement_busy;
var _IncludeFragmentElement_observer;
var _IncludeFragmentElement_handleData;
var _IncludeFragmentElement_getData;
var _IncludeFragmentElement_getStringOrErrorData;
var _IncludeFragmentElement_task;
var _IncludeFragmentElement_fetchDataWithEvents;
var privateData = /* @__PURE__ */ new WeakMap();
function isWildcard(accept) {
  return accept && !!accept.split(",").find((x) => x.match(/^\s*\*\/\*/));
}
__name(isWildcard, "isWildcard");
var cspTrustedTypesPolicyPromise = null;
var IncludeFragmentElement = class extends HTMLElement {
  constructor() {
    super(...arguments);
    _IncludeFragmentElement_instances.add(this);
    _IncludeFragmentElement_busy.set(this, false);
    _IncludeFragmentElement_observer.set(this, new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const { target } = entry;
          __classPrivateFieldGet(this, _IncludeFragmentElement_observer, "f").unobserve(target);
          if (!(target instanceof IncludeFragmentElement))
            return;
          if (target.loading === "lazy") {
            __classPrivateFieldGet(this, _IncludeFragmentElement_instances, "m", _IncludeFragmentElement_handleData).call(this);
          }
        }
      }
    }, {
      rootMargin: "0px 0px 256px 0px",
      threshold: 0.01
    }));
  }
  static define(tag = "include-fragment", registry = customElements) {
    registry.define(tag, this);
    return this;
  }
  static setCSPTrustedTypesPolicy(policy) {
    cspTrustedTypesPolicyPromise = policy === null ? policy : Promise.resolve(policy);
  }
  static get observedAttributes() {
    return ["src", "loading"];
  }
  get src() {
    const src = this.getAttribute("src");
    if (src) {
      const link = this.ownerDocument.createElement("a");
      link.href = src;
      return link.href;
    } else {
      return "";
    }
  }
  set src(val) {
    this.setAttribute("src", val);
  }
  get loading() {
    if (this.getAttribute("loading") === "lazy")
      return "lazy";
    return "eager";
  }
  set loading(value) {
    this.setAttribute("loading", value);
  }
  get accept() {
    return this.getAttribute("accept") || "";
  }
  set accept(val) {
    this.setAttribute("accept", val);
  }
  get data() {
    return __classPrivateFieldGet(this, _IncludeFragmentElement_instances, "m", _IncludeFragmentElement_getStringOrErrorData).call(this);
  }
  attributeChangedCallback(attribute, oldVal) {
    if (attribute === "src") {
      if (this.isConnected && this.loading === "eager") {
        __classPrivateFieldGet(this, _IncludeFragmentElement_instances, "m", _IncludeFragmentElement_handleData).call(this);
      }
    } else if (attribute === "loading") {
      if (this.isConnected && oldVal !== "eager" && this.loading === "eager") {
        __classPrivateFieldGet(this, _IncludeFragmentElement_instances, "m", _IncludeFragmentElement_handleData).call(this);
      }
    }
  }
  connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
      const style = document.createElement("style");
      style.textContent = `:host {display: block;}`;
      this.shadowRoot.append(style, document.createElement("slot"));
    }
    if (this.src && this.loading === "eager") {
      __classPrivateFieldGet(this, _IncludeFragmentElement_instances, "m", _IncludeFragmentElement_handleData).call(this);
    }
    if (this.loading === "lazy") {
      __classPrivateFieldGet(this, _IncludeFragmentElement_observer, "f").observe(this);
    }
  }
  request() {
    const src = this.src;
    if (!src) {
      throw new Error("missing src");
    }
    return new Request(src, {
      method: "GET",
      credentials: "same-origin",
      headers: {
        Accept: this.accept || "text/html"
      }
    });
  }
  load() {
    return __classPrivateFieldGet(this, _IncludeFragmentElement_instances, "m", _IncludeFragmentElement_getStringOrErrorData).call(this);
  }
  fetch(request) {
    return fetch(request);
  }
  refetch() {
    privateData.delete(this);
    __classPrivateFieldGet(this, _IncludeFragmentElement_instances, "m", _IncludeFragmentElement_handleData).call(this);
  }
};
__name(IncludeFragmentElement, "IncludeFragmentElement");
_IncludeFragmentElement_busy = /* @__PURE__ */ new WeakMap(), _IncludeFragmentElement_observer = /* @__PURE__ */ new WeakMap(), _IncludeFragmentElement_instances = /* @__PURE__ */ new WeakSet(), _IncludeFragmentElement_handleData = /* @__PURE__ */ __name(async function _IncludeFragmentElement_handleData2() {
  if (__classPrivateFieldGet(this, _IncludeFragmentElement_busy, "f"))
    return;
  __classPrivateFieldSet(this, _IncludeFragmentElement_busy, true, "f");
  __classPrivateFieldGet(this, _IncludeFragmentElement_observer, "f").unobserve(this);
  try {
    const data = await __classPrivateFieldGet(this, _IncludeFragmentElement_instances, "m", _IncludeFragmentElement_getData).call(this);
    if (data instanceof Error) {
      throw data;
    }
    const dataTreatedAsString = data;
    const template = document.createElement("template");
    template.innerHTML = dataTreatedAsString;
    const fragment = document.importNode(template.content, true);
    const canceled = !this.dispatchEvent(new CustomEvent("include-fragment-replace", {
      cancelable: true,
      detail: { fragment }
    }));
    if (canceled) {
      __classPrivateFieldSet(this, _IncludeFragmentElement_busy, false, "f");
      return;
    }
    this.replaceWith(fragment);
    this.dispatchEvent(new CustomEvent("include-fragment-replaced"));
  } catch (_a) {
    this.classList.add("is-error");
  } finally {
    __classPrivateFieldSet(this, _IncludeFragmentElement_busy, false, "f");
  }
}, "_IncludeFragmentElement_handleData"), _IncludeFragmentElement_getData = /* @__PURE__ */ __name(async function _IncludeFragmentElement_getData2() {
  const src = this.src;
  const cachedData = privateData.get(this);
  if (cachedData && cachedData.src === src) {
    return cachedData.data;
  } else {
    let data;
    if (src) {
      data = __classPrivateFieldGet(this, _IncludeFragmentElement_instances, "m", _IncludeFragmentElement_fetchDataWithEvents).call(this);
    } else {
      data = Promise.reject(new Error("missing src"));
    }
    privateData.set(this, { src, data });
    return data;
  }
}, "_IncludeFragmentElement_getData"), _IncludeFragmentElement_getStringOrErrorData = /* @__PURE__ */ __name(async function _IncludeFragmentElement_getStringOrErrorData2() {
  const data = await __classPrivateFieldGet(this, _IncludeFragmentElement_instances, "m", _IncludeFragmentElement_getData).call(this);
  if (data instanceof Error) {
    throw data;
  }
  return data.toString();
}, "_IncludeFragmentElement_getStringOrErrorData"), _IncludeFragmentElement_task = /* @__PURE__ */ __name(async function _IncludeFragmentElement_task2(eventsToDispatch) {
  await new Promise((resolve) => setTimeout(resolve, 0));
  for (const eventType of eventsToDispatch) {
    this.dispatchEvent(new Event(eventType));
  }
}, "_IncludeFragmentElement_task"), _IncludeFragmentElement_fetchDataWithEvents = /* @__PURE__ */ __name(async function _IncludeFragmentElement_fetchDataWithEvents2() {
  try {
    await __classPrivateFieldGet(this, _IncludeFragmentElement_instances, "m", _IncludeFragmentElement_task).call(this, ["loadstart"]);
    const response = await this.fetch(this.request());
    if (response.status !== 200) {
      throw new Error(`Failed to load resource: the server responded with a status of ${response.status}`);
    }
    const ct = response.headers.get("Content-Type");
    if (!isWildcard(this.accept) && (!ct || !ct.includes(this.accept ? this.accept : "text/html"))) {
      throw new Error(`Failed to load resource: expected ${this.accept || "text/html"} but was ${ct}`);
    }
    const responseText = await response.text();
    let data = responseText;
    if (cspTrustedTypesPolicyPromise) {
      const cspTrustedTypesPolicy = await cspTrustedTypesPolicyPromise;
      data = cspTrustedTypesPolicy.createHTML(responseText, response);
    }
    __classPrivateFieldGet(this, _IncludeFragmentElement_instances, "m", _IncludeFragmentElement_task).call(this, ["load", "loadend"]);
    return data;
  } catch (error) {
    __classPrivateFieldGet(this, _IncludeFragmentElement_instances, "m", _IncludeFragmentElement_task).call(this, ["error", "loadend"]);
    throw error;
  }
}, "_IncludeFragmentElement_fetchDataWithEvents");

// dist/include-fragment-element-define.js
var root = typeof globalThis !== "undefined" ? globalThis : window;
try {
  root.IncludeFragmentElement = IncludeFragmentElement.define();
} catch (e) {
  if (!(root.DOMException && e instanceof DOMException && e.name === "NotSupportedError") && !(e instanceof ReferenceError)) {
    throw e;
  }
}

// dist/index.js
var dist_default = IncludeFragmentElement;
export {
  IncludeFragmentElement,
  dist_default as default
};
