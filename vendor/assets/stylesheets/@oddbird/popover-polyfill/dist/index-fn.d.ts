interface PopoverToggleTargetElementInvoker {
    popoverTargetElement: HTMLElement | null;
    popoverTargetAction: 'toggle' | 'show' | 'hide';
}
declare global {
    interface ToggleEvent extends Event {
        oldState: string;
        newState: string;
    }
    interface HTMLElement {
        popover: 'auto' | 'manual' | null;
        showPopover(): void;
        hidePopover(): void;
        togglePopover(): void;
    }
    interface HTMLButtonElement extends PopoverToggleTargetElementInvoker {
    }
    interface HTMLInputElement extends PopoverToggleTargetElementInvoker {
    }
    interface Window {
        ToggleEvent: ToggleEvent;
    }
}
export { apply, isSupported } from './popover.js';
