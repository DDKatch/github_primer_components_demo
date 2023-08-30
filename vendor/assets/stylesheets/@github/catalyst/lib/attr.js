import { mustDasherize } from './dasherize.js';
import { meta } from './core.js';
const attrKey = 'attr';
/**
 * Attr is a decorator which tags a property as one to be initialized via
 * `initializeAttrs`.
 *
 * The signature is typed such that the property must be one of a String,
 * Number or Boolean. This matches the behavior of `initializeAttrs`.
 */
export function attr(proto, key) {
    meta(proto, attrKey).add(key);
}
/**
 * initializeAttrs is called with a set of class property names (if omitted, it
 * will look for any properties tagged with the `@attr` decorator). With this
 * list it defines property descriptors for each property that map to `data-*`
 * attributes on the HTMLElement instance.
 *
 * It works around Native Class Property semantics - which are equivalent to
 * calling `Object.defineProperty` on the instance upon creation, but before
 * `constructor()` is called.
 *
 * If a class property is assigned to the class body, it will infer the type
 * (using `typeof`) and define an appropriate getter/setter combo that aligns
 * to that type. This means class properties assigned to Numbers can only ever
 * be Numbers, assigned to Booleans can only ever be Booleans, and assigned to
 * Strings can only ever be Strings.
 *
 * This is automatically called as part of `@controller`. If a class uses the
 * `@controller` decorator it should not call this manually.
 */
const initialized = new WeakSet();
export function initializeAttrs(instance, names) {
    if (initialized.has(instance))
        return;
    initialized.add(instance);
    const proto = Object.getPrototypeOf(instance);
    const prefix = proto?.constructor?.attrPrefix ?? 'data-';
    if (!names)
        names = meta(proto, attrKey);
    for (const key of names) {
        const value = instance[key];
        const name = mustDasherize(`${prefix}${key}`);
        let descriptor = {
            configurable: true,
            get() {
                return this.getAttribute(name) || '';
            },
            set(newValue) {
                this.setAttribute(name, newValue || '');
            }
        };
        if (typeof value === 'number') {
            descriptor = {
                configurable: true,
                get() {
                    return Number(this.getAttribute(name) || 0);
                },
                set(newValue) {
                    this.setAttribute(name, newValue);
                }
            };
        }
        else if (typeof value === 'boolean') {
            descriptor = {
                configurable: true,
                get() {
                    return this.hasAttribute(name);
                },
                set(newValue) {
                    this.toggleAttribute(name, newValue);
                }
            };
        }
        Object.defineProperty(instance, key, descriptor);
        if (key in instance && !instance.hasAttribute(name)) {
            descriptor.set.call(instance, value);
        }
    }
}
export function defineObservedAttributes(classObject) {
    let observed = classObject.observedAttributes || [];
    const prefix = classObject.attrPrefix ?? 'data-';
    const attrToAttributeName = (name) => mustDasherize(`${prefix}${name}`);
    Object.defineProperty(classObject, 'observedAttributes', {
        configurable: true,
        get() {
            return [...meta(classObject.prototype, attrKey)].map(attrToAttributeName).concat(observed);
        },
        set(attributes) {
            observed = attributes;
        }
    });
}
//# sourceMappingURL=attr.js.map