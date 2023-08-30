"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.focusTrap = void 0;
const iterate_focusable_elements_js_1 = require("./utils/iterate-focusable-elements.js");
const event_listener_signal_js_1 = require("./polyfills/event-listener-signal.js");
(0, event_listener_signal_js_1.polyfill)();
const suspendedTrapStack = [];
let activeTrap = undefined;
function tryReactivate() {
    const trapToReactivate = suspendedTrapStack.pop();
    if (trapToReactivate) {
        focusTrap(trapToReactivate.container, trapToReactivate.initialFocus, trapToReactivate.originalSignal);
    }
}
function followSignal(signal) {
    const controller = new AbortController();
    signal.addEventListener('abort', () => {
        controller.abort();
    });
    return controller;
}
function focusTrap(container, initialFocus, abortSignal) {
    const controller = new AbortController();
    const signal = abortSignal !== null && abortSignal !== void 0 ? abortSignal : controller.signal;
    container.setAttribute('data-focus-trap', 'active');
    const sentinelStart = document.createElement('span');
    sentinelStart.setAttribute('class', 'sentinel');
    sentinelStart.setAttribute('tabindex', '0');
    sentinelStart.setAttribute('aria-hidden', 'true');
    sentinelStart.onfocus = () => {
        const lastFocusableChild = (0, iterate_focusable_elements_js_1.getFocusableChild)(container, true);
        lastFocusableChild === null || lastFocusableChild === void 0 ? void 0 : lastFocusableChild.focus();
    };
    const sentinelEnd = document.createElement('span');
    sentinelEnd.setAttribute('class', 'sentinel');
    sentinelEnd.setAttribute('tabindex', '0');
    sentinelEnd.setAttribute('aria-hidden', 'true');
    sentinelEnd.onfocus = () => {
        const firstFocusableChild = (0, iterate_focusable_elements_js_1.getFocusableChild)(container);
        firstFocusableChild === null || firstFocusableChild === void 0 ? void 0 : firstFocusableChild.focus();
    };
    container.prepend(sentinelStart);
    container.append(sentinelEnd);
    let lastFocusedChild = undefined;
    function ensureTrapZoneHasFocus(focusedElement) {
        if (focusedElement instanceof HTMLElement && document.contains(container)) {
            if (container.contains(focusedElement)) {
                lastFocusedChild = focusedElement;
                return;
            }
            else {
                if (lastFocusedChild && (0, iterate_focusable_elements_js_1.isTabbable)(lastFocusedChild) && container.contains(lastFocusedChild)) {
                    lastFocusedChild.focus();
                    return;
                }
                else if (initialFocus && container.contains(initialFocus)) {
                    initialFocus.focus();
                    return;
                }
                else {
                    const firstFocusableChild = (0, iterate_focusable_elements_js_1.getFocusableChild)(container);
                    firstFocusableChild === null || firstFocusableChild === void 0 ? void 0 : firstFocusableChild.focus();
                    return;
                }
            }
        }
    }
    const wrappingController = followSignal(signal);
    if (activeTrap) {
        const suspendedTrap = activeTrap;
        activeTrap.container.setAttribute('data-focus-trap', 'suspended');
        activeTrap.controller.abort();
        suspendedTrapStack.push(suspendedTrap);
    }
    wrappingController.signal.addEventListener('abort', () => {
        activeTrap = undefined;
    });
    signal.addEventListener('abort', () => {
        container.removeAttribute('data-focus-trap');
        const sentinels = container.getElementsByClassName('sentinel');
        while (sentinels.length > 0)
            sentinels[0].remove();
        const suspendedTrapIndex = suspendedTrapStack.findIndex(t => t.container === container);
        if (suspendedTrapIndex >= 0) {
            suspendedTrapStack.splice(suspendedTrapIndex, 1);
        }
        tryReactivate();
    });
    document.addEventListener('focus', event => {
        ensureTrapZoneHasFocus(event.target);
    }, { signal: wrappingController.signal, capture: true });
    ensureTrapZoneHasFocus(document.activeElement);
    activeTrap = {
        container,
        controller: wrappingController,
        initialFocus,
        originalSignal: signal
    };
    const suspendedTrapIndex = suspendedTrapStack.findIndex(t => t.container === container);
    if (suspendedTrapIndex >= 0) {
        suspendedTrapStack.splice(suspendedTrapIndex, 1);
    }
    if (!abortSignal) {
        return controller;
    }
}
exports.focusTrap = focusTrap;
