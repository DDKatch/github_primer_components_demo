"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.positionedOffset = exports.overflowOffset = exports.overflowParent = exports.offset = void 0;
function offset(element) {
    const rect = element.getBoundingClientRect();
    return {
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset
    };
}
exports.offset = offset;
function overflowParent(targetElement) {
    let element = targetElement;
    const document = element.ownerDocument;
    if (!document) {
        return;
    }
    if (!element.offsetParent) {
        return;
    }
    const HTMLElement = document.defaultView.HTMLElement;
    if (element === document.body) {
        return;
    }
    while (element !== document.body) {
        if (element.parentElement instanceof HTMLElement) {
            element = element.parentElement;
        }
        else {
            return;
        }
        const { position, overflowY, overflowX } = getComputedStyle(element);
        if (position === 'fixed' ||
            overflowY === 'auto' ||
            overflowX === 'auto' ||
            overflowY === 'scroll' ||
            overflowX === 'scroll') {
            break;
        }
    }
    return element instanceof Document ? null : element;
}
exports.overflowParent = overflowParent;
function overflowOffset(element, targetContainer) {
    let container = targetContainer;
    const document = element.ownerDocument;
    if (!document) {
        return;
    }
    const documentElement = document.documentElement;
    if (!documentElement) {
        return;
    }
    if (element === documentElement) {
        return;
    }
    const elementOffset = positionedOffset(element, container);
    if (!elementOffset) {
        return;
    }
    container = elementOffset._container;
    const scroll = container === document.documentElement && document.defaultView
        ? {
            top: document.defaultView.pageYOffset,
            left: document.defaultView.pageXOffset
        }
        : {
            top: container.scrollTop,
            left: container.scrollLeft
        };
    const top = elementOffset.top - scroll.top;
    const left = elementOffset.left - scroll.left;
    const height = container.clientHeight;
    const width = container.clientWidth;
    const bottom = height - (top + element.offsetHeight);
    const right = width - (left + element.offsetWidth);
    return { top, left, bottom, right, height, width };
}
exports.overflowOffset = overflowOffset;
function positionedOffset(targetElement, container) {
    let element = targetElement;
    const document = element.ownerDocument;
    if (!document) {
        return;
    }
    const documentElement = document.documentElement;
    if (!documentElement) {
        return;
    }
    const HTMLElement = document.defaultView.HTMLElement;
    let top = 0;
    let left = 0;
    const height = element.offsetHeight;
    const width = element.offsetWidth;
    while (!(element === document.body || element === container)) {
        top += element.offsetTop || 0;
        left += element.offsetLeft || 0;
        if (element.offsetParent instanceof HTMLElement) {
            element = element.offsetParent;
        }
        else {
            return;
        }
    }
    let scrollHeight;
    let scrollWidth;
    let measuredContainer;
    if (!container ||
        container === document ||
        container === document.defaultView ||
        container === document.documentElement ||
        container === document.body) {
        measuredContainer = documentElement;
        scrollHeight = getDocumentHeight(document.body, documentElement);
        scrollWidth = getDocumentWidth(document.body, documentElement);
    }
    else if (container instanceof HTMLElement) {
        measuredContainer = container;
        scrollHeight = container.scrollHeight;
        scrollWidth = container.scrollWidth;
    }
    else {
        return;
    }
    const bottom = scrollHeight - (top + height);
    const right = scrollWidth - (left + width);
    return { top, left, bottom, right, _container: measuredContainer };
}
exports.positionedOffset = positionedOffset;
function getDocumentHeight(documentBody, documentElement) {
    return Math.max(documentBody.scrollHeight, documentElement.scrollHeight, documentBody.offsetHeight, documentElement.offsetHeight, documentElement.clientHeight);
}
function getDocumentWidth(documentBody, documentElement) {
    return Math.max(documentBody.scrollWidth, documentElement.scrollWidth, documentBody.offsetWidth, documentElement.offsetWidth, documentElement.clientWidth);
}
