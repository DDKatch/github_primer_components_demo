import { getFocusableChild, isTabbable } from './utils/iterate-focusable-elements.js';
import { polyfill as eventListenerSignalPolyfill } from './polyfills/event-listener-signal.js';
eventListenerSignalPolyfill();
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
export function focusTrap(container, initialFocus, abortSignal) {
    const controller = new AbortController();
    const signal = abortSignal !== null && abortSignal !== void 0 ? abortSignal : controller.signal;
    container.setAttribute('data-focus-trap', 'active');
    const sentinelStart = document.createElement('span');
    sentinelStart.setAttribute('class', 'sentinel');
    sentinelStart.setAttribute('tabindex', '0');
    sentinelStart.setAttribute('aria-hidden', 'true');
    sentinelStart.onfocus = () => {
        const lastFocusableChild = getFocusableChild(container, true);
        lastFocusableChild === null || lastFocusableChild === void 0 ? void 0 : lastFocusableChild.focus();
    };
    const sentinelEnd = document.createElement('span');
    sentinelEnd.setAttribute('class', 'sentinel');
    sentinelEnd.setAttribute('tabindex', '0');
    sentinelEnd.setAttribute('aria-hidden', 'true');
    sentinelEnd.onfocus = () => {
        const firstFocusableChild = getFocusableChild(container);
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
                if (lastFocusedChild && isTabbable(lastFocusedChild) && container.contains(lastFocusedChild)) {
                    lastFocusedChild.focus();
                    return;
                }
                else if (initialFocus && container.contains(initialFocus)) {
                    initialFocus.focus();
                    return;
                }
                else {
                    const firstFocusableChild = getFocusableChild(container);
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
