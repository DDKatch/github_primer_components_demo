import type { CustomElementClass } from './custom-element.js';
/**
 * Controller is a decorator to be used over a class that extends HTMLElement.
 * It will automatically `register()` the component in the customElement
 * registry, as well as ensuring `bind(this)` is called on `connectedCallback`,
 * wrapping the classes `connectedCallback` method if needed.
 */
export declare function controller(classObject: CustomElementClass): void;
//# sourceMappingURL=controller.d.ts.map