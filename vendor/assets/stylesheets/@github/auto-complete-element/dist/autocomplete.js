import Combobox from '@github/combobox-nav';
import debounce from './debounce.js';
const SCREEN_READER_DELAY = window.testScreenReaderDelay || 100;
export default class Autocomplete {
    constructor(container, input, results, autoselectEnabled = false) {
        var _a;
        this.container = container;
        this.input = input;
        this.results = results;
        this.combobox = new Combobox(input, results, {
            defaultFirstOption: autoselectEnabled,
        });
        this.feedback = container.getRootNode().getElementById(`${this.results.id}-feedback`);
        this.autoselectEnabled = autoselectEnabled;
        this.clearButton = container.getRootNode().getElementById(`${this.input.id || this.input.name}-clear`);
        this.clientOptions = results.querySelectorAll('[role=option]');
        if (this.feedback) {
            this.feedback.setAttribute('aria-live', 'polite');
            this.feedback.setAttribute('aria-atomic', 'true');
        }
        if (this.clearButton && !this.clearButton.getAttribute('aria-label')) {
            const labelElem = document.querySelector(`label[for="${this.input.name}"]`);
            this.clearButton.setAttribute('aria-label', `clear:`);
            this.clearButton.setAttribute('aria-labelledby', `${this.clearButton.id} ${(labelElem === null || labelElem === void 0 ? void 0 : labelElem.id) || ''}`);
        }
        if (!this.input.getAttribute('aria-expanded')) {
            this.input.setAttribute('aria-expanded', 'false');
        }
        this.results.hidden = true;
        if (!this.results.getAttribute('aria-label')) {
            this.results.setAttribute('aria-label', 'results');
        }
        this.input.setAttribute('autocomplete', 'off');
        this.input.setAttribute('spellcheck', 'false');
        this.interactingWithList = false;
        this.onInputChange = debounce(this.onInputChange.bind(this), 300);
        this.onResultsMouseDown = this.onResultsMouseDown.bind(this);
        this.onInputBlur = this.onInputBlur.bind(this);
        this.onInputFocus = this.onInputFocus.bind(this);
        this.onKeydown = this.onKeydown.bind(this);
        this.onCommit = this.onCommit.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.input.addEventListener('keydown', this.onKeydown);
        this.input.addEventListener('focus', this.onInputFocus);
        this.input.addEventListener('blur', this.onInputBlur);
        this.input.addEventListener('input', this.onInputChange);
        this.results.addEventListener('mousedown', this.onResultsMouseDown);
        this.results.addEventListener('combobox-commit', this.onCommit);
        (_a = this.clearButton) === null || _a === void 0 ? void 0 : _a.addEventListener('click', this.handleClear);
    }
    destroy() {
        this.input.removeEventListener('keydown', this.onKeydown);
        this.input.removeEventListener('focus', this.onInputFocus);
        this.input.removeEventListener('blur', this.onInputBlur);
        this.input.removeEventListener('input', this.onInputChange);
        this.results.removeEventListener('mousedown', this.onResultsMouseDown);
        this.results.removeEventListener('combobox-commit', this.onCommit);
    }
    handleClear(event) {
        event.preventDefault();
        if (this.input.getAttribute('aria-expanded') === 'true') {
            this.input.setAttribute('aria-expanded', 'false');
            this.updateFeedbackForScreenReaders('Results hidden.');
        }
        this.input.value = '';
        this.container.value = '';
        this.input.focus();
        this.input.dispatchEvent(new Event('change'));
        this.container.open = false;
    }
    onKeydown(event) {
        if (event.key === 'Escape' && this.container.open) {
            this.container.open = false;
            event.stopPropagation();
            event.preventDefault();
        }
        else if (event.altKey && event.key === 'ArrowUp' && this.container.open) {
            this.container.open = false;
            event.stopPropagation();
            event.preventDefault();
        }
        else if (event.altKey && event.key === 'ArrowDown' && !this.container.open) {
            if (!this.input.value.trim())
                return;
            this.container.open = true;
            event.stopPropagation();
            event.preventDefault();
        }
    }
    onInputFocus() {
        this.fetchResults();
    }
    onInputBlur() {
        if (this.interactingWithList) {
            this.interactingWithList = false;
            return;
        }
        this.container.open = false;
    }
    onCommit({ target }) {
        const selected = target;
        if (!(selected instanceof HTMLElement))
            return;
        this.container.open = false;
        if (selected instanceof HTMLAnchorElement)
            return;
        const value = selected.getAttribute('data-autocomplete-value') || selected.textContent;
        this.updateFeedbackForScreenReaders(`${selected.textContent || ''} selected.`);
        this.container.value = value;
        if (!value) {
            this.updateFeedbackForScreenReaders(`Results hidden.`);
        }
    }
    onResultsMouseDown() {
        this.interactingWithList = true;
    }
    onInputChange() {
        if (this.feedback && this.feedback.textContent) {
            this.feedback.textContent = '';
        }
        this.container.removeAttribute('value');
        this.fetchResults();
    }
    identifyOptions() {
        let id = 0;
        for (const el of this.results.querySelectorAll('[role="option"]:not([id])')) {
            el.id = `${this.results.id}-option-${id++}`;
        }
    }
    updateFeedbackForScreenReaders(inputString) {
        setTimeout(() => {
            if (this.feedback) {
                this.feedback.textContent = inputString;
            }
        }, SCREEN_READER_DELAY);
    }
    fetchResults() {
        const query = this.input.value.trim();
        if (!query && !this.container.fetchOnEmpty) {
            this.container.open = false;
            return;
        }
        const src = this.container.src;
        if (!src)
            return;
        const url = new URL(src, window.location.href);
        const params = new URLSearchParams(url.search.slice(1));
        params.append('q', query);
        url.search = params.toString();
        this.container.dispatchEvent(new CustomEvent('loadstart'));
        this.container
            .fetchResult(url)
            .then(html => {
            this.results.innerHTML = html;
            this.identifyOptions();
            this.combobox.indicateDefaultOption();
            const allNewOptions = this.results.querySelectorAll('[role="option"]');
            const hasResults = !!allNewOptions.length;
            const numOptions = allNewOptions.length;
            const [firstOption] = allNewOptions;
            const firstOptionValue = firstOption === null || firstOption === void 0 ? void 0 : firstOption.textContent;
            if (this.autoselectEnabled && firstOptionValue) {
                this.updateFeedbackForScreenReaders(`${numOptions} results. ${firstOptionValue} is the top result: Press Enter to activate.`);
            }
            else {
                this.updateFeedbackForScreenReaders(`${numOptions || 'No'} results.`);
            }
            this.container.open = hasResults;
            this.container.dispatchEvent(new CustomEvent('load'));
            this.container.dispatchEvent(new CustomEvent('loadend'));
        })
            .catch(() => {
            this.container.dispatchEvent(new CustomEvent('error'));
            this.container.dispatchEvent(new CustomEvent('loadend'));
        });
    }
    open() {
        if (!this.results.hidden)
            return;
        this.combobox.start();
        this.results.hidden = false;
    }
    close() {
        if (this.results.hidden)
            return;
        this.combobox.stop();
        this.results.hidden = true;
    }
}
