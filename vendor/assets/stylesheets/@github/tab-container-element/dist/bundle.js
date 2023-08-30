var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// dist/tab-container-element.js
function getTabs(el) {
  return Array.from(el.querySelectorAll('[role="tablist"] [role="tab"]')).filter((tab) => tab instanceof HTMLElement && tab.closest(el.tagName) === el);
}
__name(getTabs, "getTabs");
function getNavigationKeyCodes(vertical) {
  if (vertical) {
    return [
      ["ArrowDown", "ArrowRight"],
      ["ArrowUp", "ArrowLeft"]
    ];
  } else {
    return [["ArrowRight"], ["ArrowLeft"]];
  }
}
__name(getNavigationKeyCodes, "getNavigationKeyCodes");
var _TabContainerElement = class extends HTMLElement {
  static define(tag = "tab-container", registry = customElements) {
    registry.define(tag, this);
    return this;
  }
  connectedCallback() {
    this.addEventListener("keydown", (event) => {
      var _a;
      const target = event.target;
      if (!(target instanceof HTMLElement))
        return;
      if (target.closest(this.tagName) !== this)
        return;
      if (target.getAttribute("role") !== "tab" && !target.closest('[role="tablist"]'))
        return;
      const tabs = getTabs(this);
      const currentIndex = tabs.indexOf(tabs.find((tab) => tab.matches('[aria-selected="true"]')));
      const [incrementKeys, decrementKeys] = getNavigationKeyCodes(((_a = target.closest('[role="tablist"]')) === null || _a === void 0 ? void 0 : _a.getAttribute("aria-orientation")) === "vertical");
      if (incrementKeys.some((code) => event.code === code)) {
        let index = currentIndex + 1;
        if (index >= tabs.length)
          index = 0;
        this.selectTab(index);
      } else if (decrementKeys.some((code) => event.code === code)) {
        let index = currentIndex - 1;
        if (index < 0)
          index = tabs.length - 1;
        this.selectTab(index);
      } else if (event.code === "Home") {
        this.selectTab(0);
        event.preventDefault();
      } else if (event.code === "End") {
        this.selectTab(tabs.length - 1);
        event.preventDefault();
      }
    });
    this.addEventListener("click", (event) => {
      const tabs = getTabs(this);
      if (!(event.target instanceof Element))
        return;
      if (event.target.closest(this.tagName) !== this)
        return;
      const tab = event.target.closest('[role="tab"]');
      if (!(tab instanceof HTMLElement) || !tab.closest('[role="tablist"]')) {
        return;
      }
      const index = tabs.indexOf(tab);
      this.selectTab(index);
    });
    for (const tab of getTabs(this)) {
      if (!tab.hasAttribute("aria-selected")) {
        tab.setAttribute("aria-selected", "false");
      }
      if (!tab.hasAttribute("tabindex")) {
        if (tab.getAttribute("aria-selected") === "true") {
          tab.setAttribute("tabindex", "0");
        } else {
          tab.setAttribute("tabindex", "-1");
        }
      }
    }
  }
  selectTab(index) {
    const tabs = getTabs(this);
    const panels = Array.from(this.querySelectorAll('[role="tabpanel"]')).filter((panel) => panel.closest(this.tagName) === this);
    if (index > tabs.length - 1) {
      throw new RangeError(`Index "${index}" out of bounds`);
    }
    const selectedTab = tabs[index];
    const selectedPanel = panels[index];
    const cancelled = !this.dispatchEvent(new CustomEvent("tab-container-change", {
      bubbles: true,
      cancelable: true,
      detail: { relatedTarget: selectedPanel }
    }));
    if (cancelled)
      return;
    for (const tab of tabs) {
      tab.setAttribute("aria-selected", "false");
      tab.setAttribute("tabindex", "-1");
    }
    for (const panel of panels) {
      panel.hidden = true;
      if (!panel.hasAttribute("tabindex") && !panel.hasAttribute("data-tab-container-no-tabstop")) {
        panel.setAttribute("tabindex", "0");
      }
    }
    selectedTab.setAttribute("aria-selected", "true");
    selectedTab.setAttribute("tabindex", "0");
    selectedTab.focus();
    selectedPanel.hidden = false;
    this.dispatchEvent(new CustomEvent("tab-container-changed", {
      bubbles: true,
      detail: { relatedTarget: selectedPanel }
    }));
  }
};
var TabContainerElement = _TabContainerElement;
__name(_TabContainerElement, "TabContainerElement");

// dist/tab-container-element-define.js
var root = typeof globalThis !== "undefined" ? globalThis : window;
try {
  root.TabContainerElement = TabContainerElement.define();
} catch (e) {
  if (!(root.DOMException && e instanceof DOMException && e.name === "NotSupportedError") && !(e instanceof ReferenceError)) {
    throw e;
  }
}

// dist/index.js
var dist_default = TabContainerElement;
export {
  TabContainerElement,
  dist_default as default
};
