export function* iterateFocusableElements(container, options = {}) {
    var _a, _b;
    const strict = (_a = options.strict) !== null && _a !== void 0 ? _a : false;
    const acceptFn = ((_b = options.onlyTabbable) !== null && _b !== void 0 ? _b : false) ? isTabbable : isFocusable;
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
        acceptNode: node => node instanceof HTMLElement && acceptFn(node, strict) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
    });
    let nextNode = null;
    if (!options.reverse && acceptFn(container, strict)) {
        yield container;
    }
    if (options.reverse) {
        let lastChild = walker.lastChild();
        while (lastChild) {
            nextNode = lastChild;
            lastChild = walker.lastChild();
        }
    }
    else {
        nextNode = walker.firstChild();
    }
    while (nextNode instanceof HTMLElement) {
        yield nextNode;
        nextNode = options.reverse ? walker.previousNode() : walker.nextNode();
    }
    if (options.reverse && acceptFn(container, strict)) {
        yield container;
    }
    return undefined;
}
export function getFocusableChild(container, lastChild = false) {
    return iterateFocusableElements(container, { reverse: lastChild, strict: true, onlyTabbable: true }).next().value;
}
export function isFocusable(elem, strict = false) {
    const disabledAttrInert = ['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'OPTGROUP', 'OPTION', 'FIELDSET'].includes(elem.tagName) &&
        elem.disabled;
    const hiddenInert = elem.hidden;
    const hiddenInputInert = elem instanceof HTMLInputElement && elem.type === 'hidden';
    const sentinelInert = elem.classList.contains('sentinel');
    if (disabledAttrInert || hiddenInert || hiddenInputInert || sentinelInert) {
        return false;
    }
    if (strict) {
        const sizeInert = elem.offsetWidth === 0 || elem.offsetHeight === 0;
        const visibilityInert = ['hidden', 'collapse'].includes(getComputedStyle(elem).visibility);
        const clientRectsInert = elem.getClientRects().length === 0;
        if (sizeInert || visibilityInert || clientRectsInert) {
            return false;
        }
    }
    if (elem.getAttribute('tabindex') != null) {
        return true;
    }
    if (elem instanceof HTMLAnchorElement && elem.getAttribute('href') == null) {
        return false;
    }
    return elem.tabIndex !== -1;
}
export function isTabbable(elem, strict = false) {
    return isFocusable(elem, strict) && elem.getAttribute('tabindex') !== '-1';
}
