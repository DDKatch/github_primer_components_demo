import { polyfill as eventListenerSignalPolyfill } from './polyfills/event-listener-signal.js';
import { isMacOS } from './utils/user-agent.js';
import { iterateFocusableElements } from './utils/iterate-focusable-elements.js';
import { uniqueId } from './utils/unique-id.js';
eventListenerSignalPolyfill();
export var FocusKeys;
(function (FocusKeys) {
    FocusKeys[FocusKeys["ArrowHorizontal"] = 1] = "ArrowHorizontal";
    FocusKeys[FocusKeys["ArrowVertical"] = 2] = "ArrowVertical";
    FocusKeys[FocusKeys["JK"] = 4] = "JK";
    FocusKeys[FocusKeys["HL"] = 8] = "HL";
    FocusKeys[FocusKeys["HomeAndEnd"] = 16] = "HomeAndEnd";
    FocusKeys[FocusKeys["PageUpDown"] = 256] = "PageUpDown";
    FocusKeys[FocusKeys["WS"] = 32] = "WS";
    FocusKeys[FocusKeys["AD"] = 64] = "AD";
    FocusKeys[FocusKeys["Tab"] = 128] = "Tab";
    FocusKeys[FocusKeys["Backspace"] = 512] = "Backspace";
    FocusKeys[FocusKeys["ArrowAll"] = 3] = "ArrowAll";
    FocusKeys[FocusKeys["HJKL"] = 12] = "HJKL";
    FocusKeys[FocusKeys["WASD"] = 96] = "WASD";
    FocusKeys[FocusKeys["All"] = 511] = "All";
})(FocusKeys || (FocusKeys = {}));
const KEY_TO_BIT = {
    ArrowLeft: FocusKeys.ArrowHorizontal,
    ArrowDown: FocusKeys.ArrowVertical,
    ArrowUp: FocusKeys.ArrowVertical,
    ArrowRight: FocusKeys.ArrowHorizontal,
    h: FocusKeys.HL,
    j: FocusKeys.JK,
    k: FocusKeys.JK,
    l: FocusKeys.HL,
    a: FocusKeys.AD,
    s: FocusKeys.WS,
    w: FocusKeys.WS,
    d: FocusKeys.AD,
    Tab: FocusKeys.Tab,
    Home: FocusKeys.HomeAndEnd,
    End: FocusKeys.HomeAndEnd,
    PageUp: FocusKeys.PageUpDown,
    PageDown: FocusKeys.PageUpDown,
    Backspace: FocusKeys.Backspace
};
const KEY_TO_DIRECTION = {
    ArrowLeft: 'previous',
    ArrowDown: 'next',
    ArrowUp: 'previous',
    ArrowRight: 'next',
    h: 'previous',
    j: 'next',
    k: 'previous',
    l: 'next',
    a: 'previous',
    s: 'next',
    w: 'previous',
    d: 'next',
    Tab: 'next',
    Home: 'start',
    End: 'end',
    PageUp: 'start',
    PageDown: 'end',
    Backspace: 'previous'
};
function getDirection(keyboardEvent) {
    const direction = KEY_TO_DIRECTION[keyboardEvent.key];
    if (keyboardEvent.key === 'Tab' && keyboardEvent.shiftKey) {
        return 'previous';
    }
    const isMac = isMacOS();
    if ((isMac && keyboardEvent.metaKey) || (!isMac && keyboardEvent.ctrlKey)) {
        if (keyboardEvent.key === 'ArrowLeft' || keyboardEvent.key === 'ArrowUp') {
            return 'start';
        }
        else if (keyboardEvent.key === 'ArrowRight' || keyboardEvent.key === 'ArrowDown') {
            return 'end';
        }
    }
    return direction;
}
function shouldIgnoreFocusHandling(keyboardEvent, activeElement) {
    const key = keyboardEvent.key;
    const keyLength = [...key].length;
    const isTextInput = (activeElement instanceof HTMLInputElement && activeElement.type === 'text') ||
        activeElement instanceof HTMLTextAreaElement;
    if (isTextInput && (keyLength === 1 || key === 'Home' || key === 'End')) {
        return true;
    }
    if (activeElement instanceof HTMLSelectElement) {
        if (keyLength === 1) {
            return true;
        }
        if (key === 'ArrowDown' && isMacOS() && !keyboardEvent.metaKey) {
            return true;
        }
        if (key === 'ArrowDown' && !isMacOS() && keyboardEvent.altKey) {
            return true;
        }
    }
    if (activeElement instanceof HTMLTextAreaElement && (key === 'PageUp' || key === 'PageDown')) {
        return true;
    }
    if (isTextInput) {
        const textInput = activeElement;
        const cursorAtStart = textInput.selectionStart === 0 && textInput.selectionEnd === 0;
        const cursorAtEnd = textInput.selectionStart === textInput.value.length && textInput.selectionEnd === textInput.value.length;
        if (key === 'ArrowLeft' && !cursorAtStart) {
            return true;
        }
        if (key === 'ArrowRight' && !cursorAtEnd) {
            return true;
        }
        if (textInput instanceof HTMLTextAreaElement) {
            if (key === 'ArrowUp' && !cursorAtStart) {
                return true;
            }
            if (key === 'ArrowDown' && !cursorAtEnd) {
                return true;
            }
        }
    }
    return false;
}
export const isActiveDescendantAttribute = 'data-is-active-descendant';
export const activeDescendantActivatedDirectly = 'activated-directly';
export const activeDescendantActivatedIndirectly = 'activated-indirectly';
export const hasActiveDescendantAttribute = 'data-has-active-descendant';
export function focusZone(container, settings) {
    var _a, _b, _c, _d, _e;
    const focusableElements = [];
    const savedTabIndex = new WeakMap();
    const bindKeys = (_a = settings === null || settings === void 0 ? void 0 : settings.bindKeys) !== null && _a !== void 0 ? _a : ((settings === null || settings === void 0 ? void 0 : settings.getNextFocusable) ? FocusKeys.ArrowAll : FocusKeys.ArrowVertical) | FocusKeys.HomeAndEnd;
    const focusOutBehavior = (_b = settings === null || settings === void 0 ? void 0 : settings.focusOutBehavior) !== null && _b !== void 0 ? _b : 'stop';
    const focusInStrategy = (_c = settings === null || settings === void 0 ? void 0 : settings.focusInStrategy) !== null && _c !== void 0 ? _c : 'previous';
    const activeDescendantControl = settings === null || settings === void 0 ? void 0 : settings.activeDescendantControl;
    const activeDescendantCallback = settings === null || settings === void 0 ? void 0 : settings.onActiveDescendantChanged;
    let currentFocusedElement;
    const preventScroll = (_d = settings === null || settings === void 0 ? void 0 : settings.preventScroll) !== null && _d !== void 0 ? _d : false;
    function getFirstFocusableElement() {
        return focusableElements[0];
    }
    function isActiveDescendantInputFocused() {
        return document.activeElement === activeDescendantControl;
    }
    function updateFocusedElement(to, directlyActivated = false) {
        const from = currentFocusedElement;
        currentFocusedElement = to;
        if (activeDescendantControl) {
            if (to && isActiveDescendantInputFocused()) {
                setActiveDescendant(from, to, directlyActivated);
            }
            else {
                clearActiveDescendant();
            }
            return;
        }
        if (from && from !== to && savedTabIndex.has(from)) {
            from.setAttribute('tabindex', '-1');
        }
        to === null || to === void 0 ? void 0 : to.setAttribute('tabindex', '0');
    }
    function setActiveDescendant(from, to, directlyActivated = false) {
        if (!to.id) {
            to.setAttribute('id', uniqueId());
        }
        if (from && from !== to) {
            from.removeAttribute(isActiveDescendantAttribute);
        }
        if (!activeDescendantControl ||
            (!directlyActivated && activeDescendantControl.getAttribute('aria-activedescendant') === to.id)) {
            return;
        }
        activeDescendantControl.setAttribute('aria-activedescendant', to.id);
        container.setAttribute(hasActiveDescendantAttribute, to.id);
        to.setAttribute(isActiveDescendantAttribute, directlyActivated ? activeDescendantActivatedDirectly : activeDescendantActivatedIndirectly);
        activeDescendantCallback === null || activeDescendantCallback === void 0 ? void 0 : activeDescendantCallback(to, from, directlyActivated);
    }
    function clearActiveDescendant(previouslyActiveElement = currentFocusedElement) {
        if (focusInStrategy === 'first') {
            currentFocusedElement = undefined;
        }
        activeDescendantControl === null || activeDescendantControl === void 0 ? void 0 : activeDescendantControl.removeAttribute('aria-activedescendant');
        container.removeAttribute(hasActiveDescendantAttribute);
        previouslyActiveElement === null || previouslyActiveElement === void 0 ? void 0 : previouslyActiveElement.removeAttribute(isActiveDescendantAttribute);
        activeDescendantCallback === null || activeDescendantCallback === void 0 ? void 0 : activeDescendantCallback(undefined, previouslyActiveElement, false);
    }
    function beginFocusManagement(...elements) {
        const filteredElements = elements.filter(e => { var _a, _b; return (_b = (_a = settings === null || settings === void 0 ? void 0 : settings.focusableElementFilter) === null || _a === void 0 ? void 0 : _a.call(settings, e)) !== null && _b !== void 0 ? _b : true; });
        if (filteredElements.length === 0) {
            return;
        }
        focusableElements.splice(findInsertionIndex(filteredElements), 0, ...filteredElements);
        for (const element of filteredElements) {
            if (!savedTabIndex.has(element)) {
                savedTabIndex.set(element, element.getAttribute('tabindex'));
            }
            element.setAttribute('tabindex', '-1');
        }
        if (!currentFocusedElement) {
            updateFocusedElement(getFirstFocusableElement());
        }
    }
    function findInsertionIndex(elementsToInsert) {
        const firstElementToInsert = elementsToInsert[0];
        if (focusableElements.length === 0)
            return 0;
        let iMin = 0;
        let iMax = focusableElements.length - 1;
        while (iMin <= iMax) {
            const i = Math.floor((iMin + iMax) / 2);
            const element = focusableElements[i];
            if (followsInDocument(firstElementToInsert, element)) {
                iMax = i - 1;
            }
            else {
                iMin = i + 1;
            }
        }
        return iMin;
    }
    function followsInDocument(first, second) {
        return (second.compareDocumentPosition(first) & Node.DOCUMENT_POSITION_PRECEDING) > 0;
    }
    function endFocusManagement(...elements) {
        for (const element of elements) {
            const focusableElementIndex = focusableElements.indexOf(element);
            if (focusableElementIndex >= 0) {
                focusableElements.splice(focusableElementIndex, 1);
            }
            const savedIndex = savedTabIndex.get(element);
            if (savedIndex !== undefined) {
                if (savedIndex === null) {
                    element.removeAttribute('tabindex');
                }
                else {
                    element.setAttribute('tabindex', savedIndex);
                }
                savedTabIndex.delete(element);
            }
            if (element === currentFocusedElement) {
                const nextElementToFocus = getFirstFocusableElement();
                updateFocusedElement(nextElementToFocus);
            }
        }
    }
    beginFocusManagement(...iterateFocusableElements(container));
    const initialElement = typeof focusInStrategy === 'function' ? focusInStrategy(document.body) : getFirstFocusableElement();
    updateFocusedElement(initialElement);
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const removedNode of mutation.removedNodes) {
                if (removedNode instanceof HTMLElement) {
                    endFocusManagement(...iterateFocusableElements(removedNode));
                }
            }
        }
        for (const mutation of mutations) {
            for (const addedNode of mutation.addedNodes) {
                if (addedNode instanceof HTMLElement) {
                    beginFocusManagement(...iterateFocusableElements(addedNode));
                }
            }
        }
    });
    observer.observe(container, {
        subtree: true,
        childList: true
    });
    const controller = new AbortController();
    const signal = (_e = settings === null || settings === void 0 ? void 0 : settings.abortSignal) !== null && _e !== void 0 ? _e : controller.signal;
    signal.addEventListener('abort', () => {
        endFocusManagement(...focusableElements);
    });
    let elementIndexFocusedByClick = undefined;
    container.addEventListener('mousedown', event => {
        if (event.target instanceof HTMLElement && event.target !== document.activeElement) {
            elementIndexFocusedByClick = focusableElements.indexOf(event.target);
        }
    }, { signal });
    if (activeDescendantControl) {
        container.addEventListener('focusin', event => {
            if (event.target instanceof HTMLElement && focusableElements.includes(event.target)) {
                activeDescendantControl.focus({ preventScroll });
                updateFocusedElement(event.target);
            }
        });
        container.addEventListener('mousemove', ({ target }) => {
            if (!(target instanceof Node)) {
                return;
            }
            const focusableElement = focusableElements.find(element => element.contains(target));
            if (focusableElement) {
                updateFocusedElement(focusableElement);
            }
        }, { signal, capture: true });
        activeDescendantControl.addEventListener('focusin', () => {
            if (!currentFocusedElement) {
                updateFocusedElement(getFirstFocusableElement());
            }
            else {
                setActiveDescendant(undefined, currentFocusedElement);
            }
        });
        activeDescendantControl.addEventListener('focusout', () => {
            clearActiveDescendant();
        });
    }
    else {
        container.addEventListener('focusin', event => {
            if (event.target instanceof HTMLElement) {
                if (elementIndexFocusedByClick !== undefined) {
                    if (elementIndexFocusedByClick >= 0) {
                        if (focusableElements[elementIndexFocusedByClick] !== currentFocusedElement) {
                            updateFocusedElement(focusableElements[elementIndexFocusedByClick]);
                        }
                    }
                    elementIndexFocusedByClick = undefined;
                }
                else {
                    if (focusInStrategy === 'previous') {
                        updateFocusedElement(event.target);
                    }
                    else if (focusInStrategy === 'closest' || focusInStrategy === 'first') {
                        if (event.relatedTarget instanceof Element && !container.contains(event.relatedTarget)) {
                            const targetElementIndex = lastKeyboardFocusDirection === 'previous' ? focusableElements.length - 1 : 0;
                            const targetElement = focusableElements[targetElementIndex];
                            targetElement === null || targetElement === void 0 ? void 0 : targetElement.focus({ preventScroll });
                            return;
                        }
                        else {
                            updateFocusedElement(event.target);
                        }
                    }
                    else if (typeof focusInStrategy === 'function') {
                        if (event.relatedTarget instanceof Element && !container.contains(event.relatedTarget)) {
                            const elementToFocus = focusInStrategy(event.relatedTarget);
                            const requestedFocusElementIndex = elementToFocus ? focusableElements.indexOf(elementToFocus) : -1;
                            if (requestedFocusElementIndex >= 0 && elementToFocus instanceof HTMLElement) {
                                elementToFocus.focus({ preventScroll });
                                return;
                            }
                            else {
                                console.warn('Element requested is not a known focusable element.');
                            }
                        }
                        else {
                            updateFocusedElement(event.target);
                        }
                    }
                }
            }
            lastKeyboardFocusDirection = undefined;
        }, { signal });
    }
    const keyboardEventRecipient = activeDescendantControl !== null && activeDescendantControl !== void 0 ? activeDescendantControl : container;
    let lastKeyboardFocusDirection = undefined;
    if (focusInStrategy === 'closest') {
        document.addEventListener('keydown', event => {
            if (event.key === 'Tab') {
                lastKeyboardFocusDirection = getDirection(event);
            }
        }, { signal, capture: true });
    }
    function getCurrentFocusedIndex() {
        if (!currentFocusedElement) {
            return 0;
        }
        const focusedIndex = focusableElements.indexOf(currentFocusedElement);
        const fallbackIndex = currentFocusedElement === container ? -1 : 0;
        return focusedIndex !== -1 ? focusedIndex : fallbackIndex;
    }
    keyboardEventRecipient.addEventListener('keydown', event => {
        var _a;
        if (event.key in KEY_TO_DIRECTION) {
            const keyBit = KEY_TO_BIT[event.key];
            if (!event.defaultPrevented &&
                (keyBit & bindKeys) > 0 &&
                !shouldIgnoreFocusHandling(event, document.activeElement)) {
                const direction = getDirection(event);
                let nextElementToFocus = undefined;
                if (settings === null || settings === void 0 ? void 0 : settings.getNextFocusable) {
                    nextElementToFocus = settings.getNextFocusable(direction, (_a = document.activeElement) !== null && _a !== void 0 ? _a : undefined, event);
                }
                if (!nextElementToFocus) {
                    const lastFocusedIndex = getCurrentFocusedIndex();
                    let nextFocusedIndex = lastFocusedIndex;
                    if (direction === 'previous') {
                        nextFocusedIndex -= 1;
                    }
                    else if (direction === 'start') {
                        nextFocusedIndex = 0;
                    }
                    else if (direction === 'next') {
                        nextFocusedIndex += 1;
                    }
                    else {
                        nextFocusedIndex = focusableElements.length - 1;
                    }
                    if (nextFocusedIndex < 0) {
                        if (focusOutBehavior === 'wrap' && event.key !== 'Tab') {
                            nextFocusedIndex = focusableElements.length - 1;
                        }
                        else {
                            nextFocusedIndex = 0;
                        }
                    }
                    if (nextFocusedIndex >= focusableElements.length) {
                        if (focusOutBehavior === 'wrap' && event.key !== 'Tab') {
                            nextFocusedIndex = 0;
                        }
                        else {
                            nextFocusedIndex = focusableElements.length - 1;
                        }
                    }
                    if (lastFocusedIndex !== nextFocusedIndex) {
                        nextElementToFocus = focusableElements[nextFocusedIndex];
                    }
                }
                if (activeDescendantControl) {
                    updateFocusedElement(nextElementToFocus || currentFocusedElement, true);
                }
                else if (nextElementToFocus) {
                    lastKeyboardFocusDirection = direction;
                    nextElementToFocus.focus({ preventScroll });
                }
                if (event.key !== 'Tab' || nextElementToFocus) {
                    event.preventDefault();
                }
            }
        }
    }, { signal });
    return controller;
}
