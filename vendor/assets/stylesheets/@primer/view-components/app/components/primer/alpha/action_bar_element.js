var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ActionBarElement_instances, _ActionBarElement_initialBarWidth, _ActionBarElement_previousBarWidth, _ActionBarElement_focusZoneAbortController, _ActionBarElement_itemGap, _ActionBarElement_availableSpace, _ActionBarElement_menuSpace, _ActionBarElement_shrink, _ActionBarElement_grow, _ActionBarElement_showItem, _ActionBarElement_hideItem, _ActionBarElement_menuItems_get;
import { controller, targets, target } from '@github/catalyst';
import { focusZone, FocusKeys } from '@primer/behaviors';
const instersectionObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
        const action = entry.target;
        if (entry.isIntersecting && action instanceof ActionBarElement) {
            action.update();
        }
    }
});
const resizeObserver = new ResizeObserver(entries => {
    for (const entry of entries) {
        const action = entry.target;
        if (action instanceof ActionBarElement) {
            action.update(entry.contentRect);
        }
    }
});
let ActionBarElement = class ActionBarElement extends HTMLElement {
    constructor() {
        super(...arguments);
        _ActionBarElement_instances.add(this);
        _ActionBarElement_initialBarWidth.set(this, void 0);
        _ActionBarElement_previousBarWidth.set(this, void 0);
        _ActionBarElement_focusZoneAbortController.set(this, null);
    }
    connectedCallback() {
        var _a, _b, _c, _d;
        __classPrivateFieldSet(this, _ActionBarElement_previousBarWidth, (_a = this.offsetWidth) !== null && _a !== void 0 ? _a : Infinity, "f");
        __classPrivateFieldSet(this, _ActionBarElement_initialBarWidth, (_b = this.itemContainer.offsetWidth) !== null && _b !== void 0 ? _b : Infinity, "f");
        // Calculate the width of all the items before hiding anything
        for (const item of this.items) {
            const width = item.getBoundingClientRect().width;
            const marginLeft = parseInt((_c = window.getComputedStyle(item)) === null || _c === void 0 ? void 0 : _c.marginLeft, 10);
            const marginRight = parseInt((_d = window.getComputedStyle(item)) === null || _d === void 0 ? void 0 : _d.marginRight, 10);
            item.setAttribute('data-offset-width', `${width + marginLeft + marginRight}`);
        }
        resizeObserver.observe(this);
        instersectionObserver.observe(this);
        setTimeout(() => {
            this.style.overflow = 'visible';
            this.update();
        }, 20); // Wait for the items to be rendered, making this really short to avoid a flash of unstyled content
    }
    disconnectedCallback() {
        resizeObserver.unobserve(this);
        instersectionObserver.unobserve(this);
    }
    menuItemClick(event) {
        var _a;
        const currentTarget = event.currentTarget;
        const id = currentTarget === null || currentTarget === void 0 ? void 0 : currentTarget.getAttribute('data-for');
        if (id) {
            (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.click();
        }
    }
    update(rect = this.getBoundingClientRect()) {
        // Only recalculate if the bar width changed
        if (rect.width <= __classPrivateFieldGet(this, _ActionBarElement_previousBarWidth, "f") || __classPrivateFieldGet(this, _ActionBarElement_previousBarWidth, "f") === 0) {
            __classPrivateFieldGet(this, _ActionBarElement_instances, "m", _ActionBarElement_shrink).call(this);
        }
        else if (rect.width > __classPrivateFieldGet(this, _ActionBarElement_previousBarWidth, "f")) {
            __classPrivateFieldGet(this, _ActionBarElement_instances, "m", _ActionBarElement_grow).call(this);
        }
        __classPrivateFieldSet(this, _ActionBarElement_previousBarWidth, rect.width, "f");
        if (rect.width <= __classPrivateFieldGet(this, _ActionBarElement_initialBarWidth, "f")) {
            this.style.justifyContent = 'space-between';
        }
        else {
            this.style.justifyContent = 'flex-end';
        }
        if (__classPrivateFieldGet(this, _ActionBarElement_focusZoneAbortController, "f")) {
            __classPrivateFieldGet(this, _ActionBarElement_focusZoneAbortController, "f").abort();
        }
        __classPrivateFieldSet(this, _ActionBarElement_focusZoneAbortController, focusZone(this.itemContainer, {
            bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.HomeAndEnd,
            focusOutBehavior: 'wrap',
            focusableElementFilter: element => {
                return !element.closest('.ActionBar-item[hidden]');
            }
        }), "f");
    }
};
_ActionBarElement_initialBarWidth = new WeakMap(), _ActionBarElement_previousBarWidth = new WeakMap(), _ActionBarElement_focusZoneAbortController = new WeakMap(), _ActionBarElement_instances = new WeakSet(), _ActionBarElement_itemGap = function _ActionBarElement_itemGap() {
    var _a;
    return parseInt((_a = window.getComputedStyle(this.itemContainer)) === null || _a === void 0 ? void 0 : _a.columnGap, 10) || 0;
}, _ActionBarElement_availableSpace = function _ActionBarElement_availableSpace() {
    // Get the offset of the item container from the container edge
    return this.offsetWidth - this.itemContainer.offsetWidth;
}, _ActionBarElement_menuSpace = function _ActionBarElement_menuSpace() {
    if (this.moreMenu.hidden) {
        return 0;
    }
    return this.moreMenu.offsetWidth + __classPrivateFieldGet(this, _ActionBarElement_instances, "m", _ActionBarElement_itemGap).call(this);
}, _ActionBarElement_shrink = function _ActionBarElement_shrink() {
    if (this.items[0].hidden) {
        return;
    }
    let index = this.items.length - 1;
    for (const item of this.items.reverse()) {
        if (!item.hidden && __classPrivateFieldGet(this, _ActionBarElement_instances, "m", _ActionBarElement_availableSpace).call(this) < __classPrivateFieldGet(this, _ActionBarElement_instances, "m", _ActionBarElement_menuSpace).call(this)) {
            __classPrivateFieldGet(this, _ActionBarElement_instances, "m", _ActionBarElement_hideItem).call(this, index);
        }
        else if (__classPrivateFieldGet(this, _ActionBarElement_instances, "m", _ActionBarElement_availableSpace).call(this) >= __classPrivateFieldGet(this, _ActionBarElement_instances, "m", _ActionBarElement_menuSpace).call(this)) {
            return;
        }
        index--;
    }
}, _ActionBarElement_grow = function _ActionBarElement_grow() {
    // If last item is visible, there is no need to grow
    if (!this.items[this.items.length - 1].hidden) {
        return;
    }
    let index = 0;
    for (const item of this.items) {
        if (item.hidden) {
            const offsetWidth = Number(item.getAttribute('data-offset-width'));
            if (__classPrivateFieldGet(this, _ActionBarElement_instances, "m", _ActionBarElement_availableSpace).call(this) >= __classPrivateFieldGet(this, _ActionBarElement_instances, "m", _ActionBarElement_menuSpace).call(this) + offsetWidth || index === this.items.length - 1) {
                __classPrivateFieldGet(this, _ActionBarElement_instances, "m", _ActionBarElement_showItem).call(this, index);
            }
            else {
                return;
            }
        }
        index++;
    }
    if (!this.items[this.items.length - 1].hidden) {
        this.moreMenu.hidden = true;
    }
}, _ActionBarElement_showItem = function _ActionBarElement_showItem(index) {
    this.items[index].hidden = false;
    __classPrivateFieldGet(this, _ActionBarElement_instances, "a", _ActionBarElement_menuItems_get)[index].hidden = true;
}, _ActionBarElement_hideItem = function _ActionBarElement_hideItem(index) {
    this.items[index].hidden = true;
    __classPrivateFieldGet(this, _ActionBarElement_instances, "a", _ActionBarElement_menuItems_get)[index].hidden = false;
    if (this.moreMenu.hidden) {
        this.moreMenu.hidden = false;
    }
}, _ActionBarElement_menuItems_get = function _ActionBarElement_menuItems_get() {
    return this.moreMenu.querySelectorAll('[role="menu"] > li');
};
__decorate([
    targets
], ActionBarElement.prototype, "items", void 0);
__decorate([
    target
], ActionBarElement.prototype, "itemContainer", void 0);
__decorate([
    target
], ActionBarElement.prototype, "moreMenu", void 0);
ActionBarElement = __decorate([
    controller
], ActionBarElement);
window.ActionBarElement = ActionBarElement;
