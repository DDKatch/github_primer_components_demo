const dynamicElements = new Map();
const ready = new Promise(resolve => {
    if (document.readyState !== 'loading') {
        resolve();
    }
    else {
        document.addEventListener('readystatechange', () => resolve(), { once: true });
    }
});
const firstInteraction = new Promise(resolve => {
    const controller = new AbortController();
    controller.signal.addEventListener('abort', () => resolve());
    const listenerOptions = { once: true, passive: true, signal: controller.signal };
    const handler = () => controller.abort();
    document.addEventListener('mousedown', handler, listenerOptions);
    // eslint-disable-next-line github/require-passive-events
    document.addEventListener('touchstart', handler, listenerOptions);
    document.addEventListener('keydown', handler, listenerOptions);
    document.addEventListener('pointerdown', handler, listenerOptions);
});
const visible = (tagName) => new Promise(resolve => {
    const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                resolve();
                observer.disconnect();
                return;
            }
        }
    }, {
        // Currently the threshold is set to 256px from the bottom of the viewport
        // with a threshold of 0.1. This means the element will not load until about
        // 2 keyboard-down-arrow presses away from being visible in the viewport,
        // giving us some time to fetch it before the contents are made visible
        rootMargin: '0px 0px 256px 0px',
        threshold: 0.01
    });
    for (const el of document.querySelectorAll(tagName)) {
        observer.observe(el);
    }
});
const strategies = {
    ready: () => ready,
    firstInteraction: () => firstInteraction,
    visible
};
const timers = new WeakMap();
function scan(node) {
    cancelAnimationFrame(timers.get(node) || 0);
    timers.set(node, requestAnimationFrame(() => {
        for (const tagName of dynamicElements.keys()) {
            const child = node.matches(tagName) ? node : node.querySelector(tagName);
            if (customElements.get(tagName) || child) {
                const strategyName = (child?.getAttribute('data-load-on') || 'ready');
                const strategy = strategyName in strategies ? strategies[strategyName] : strategies.ready;
                // eslint-disable-next-line github/no-then
                for (const cb of dynamicElements.get(tagName) || [])
                    strategy(tagName).then(cb);
                dynamicElements.delete(tagName);
                timers.delete(node);
            }
        }
    }));
}
let elementLoader;
export function lazyDefine(tagName, callback) {
    if (!dynamicElements.has(tagName))
        dynamicElements.set(tagName, new Set());
    dynamicElements.get(tagName).add(callback);
    scan(document.body);
    if (!elementLoader) {
        elementLoader = new MutationObserver(mutations => {
            if (!dynamicElements.size)
                return;
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node instanceof Element)
                        scan(node);
                }
            }
        });
        elementLoader.observe(document, { subtree: true, childList: true });
    }
}
//# sourceMappingURL=lazy-define.js.map