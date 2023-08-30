const controllers = new WeakSet();
/*
 * Bind `[data-action]` elements from the DOM to their actions.
 *
 */
export function bind(controller) {
    controllers.add(controller);
    if (controller.shadowRoot)
        bindShadow(controller.shadowRoot);
    bindElements(controller);
    listenForBind(controller.ownerDocument);
}
export function bindShadow(root) {
    bindElements(root);
    listenForBind(root);
}
const observers = new WeakMap();
/**
 * Set up observer that will make sure any actions that are dynamically
 * injected into `el` will be bound to it's controller.
 *
 * This returns a Subscription object which you can call `unsubscribe()` on to
 * stop further live updates.
 */
export function listenForBind(el = document) {
    if (observers.has(el))
        return observers.get(el);
    let closed = false;
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.type === 'attributes' && mutation.target instanceof Element) {
                bindActions(mutation.target);
            }
            else if (mutation.type === 'childList' && mutation.addedNodes.length) {
                for (const node of mutation.addedNodes) {
                    if (node instanceof Element) {
                        bindElements(node);
                    }
                }
            }
        }
    });
    observer.observe(el, { childList: true, subtree: true, attributeFilter: ['data-action'] });
    const subscription = {
        get closed() {
            return closed;
        },
        unsubscribe() {
            closed = true;
            observers.delete(el);
            observer.disconnect();
        }
    };
    observers.set(el, subscription);
    return subscription;
}
function bindElements(root) {
    for (const el of root.querySelectorAll('[data-action]')) {
        bindActions(el);
    }
    // Also bind the controller to itself
    if (root instanceof Element && root.hasAttribute('data-action')) {
        bindActions(root);
    }
}
// Bind a single function to all events to avoid anonymous closure performance penalty.
function handleEvent(event) {
    const el = event.currentTarget;
    for (const binding of bindings(el)) {
        if (event.type === binding.type) {
            const controller = el.closest(binding.tag);
            if (controllers.has(controller) && typeof controller[binding.method] === 'function') {
                controller[binding.method](event);
            }
            const root = el.getRootNode();
            if (root instanceof ShadowRoot && controllers.has(root.host) && root.host.matches(binding.tag)) {
                const shadowController = root.host;
                if (typeof shadowController[binding.method] === 'function') {
                    shadowController[binding.method](event);
                }
            }
        }
    }
}
function* bindings(el) {
    for (const action of (el.getAttribute('data-action') || '').trim().split(/\s+/)) {
        const eventSep = action.lastIndexOf(':');
        const methodSep = Math.max(0, action.lastIndexOf('#')) || action.length;
        yield {
            type: action.slice(0, eventSep),
            tag: action.slice(eventSep + 1, methodSep),
            method: action.slice(methodSep + 1) || 'handleEvent'
        } || 'handleEvent';
    }
}
function bindActions(el) {
    for (const binding of bindings(el)) {
        el.addEventListener(binding.type, handleEvent);
    }
}
//# sourceMappingURL=bind.js.map