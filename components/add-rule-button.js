import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/button/button-subtle.js';
import '@brightspace-ui/core/components/dialog/dialog.js';
import '@brightspace-ui/core/components/inputs/input-text.js';
import './rule-picker.js';

import { html, LitElement } from 'lit-element/lit-element.js';
import { LocalizeElement } from '../locales/localize-element.js';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';

class AddRuleButton extends LocalizeElement(RtlMixin(LitElement)) {

	render() {
		return html``;
	}
}
window.customElements.define('add-rule-button', AddRuleButton);

