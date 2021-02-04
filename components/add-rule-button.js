import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/button/button-subtle.js';
import '@brightspace-ui/core/components/dialog/dialog.js';
import '@brightspace-ui/core/components/inputs/input-text.js';
import './condition-picker-dialog.js';

import { html, LitElement } from 'lit-element/lit-element.js';
import { LocalizeElement } from '../locales/localize-element.js';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';

class AddRuleButton extends LocalizeElement(RtlMixin(LitElement)) {
	static get properties() {
		return {
			conditionList: {
				type: Array,
			},
			conditionTypes: {
				type: Array
			},
			defaultType: {
				type: String
			},
			opened: {
				type:Boolean
			}
		};
	}

	constructor() {
		super();
		this.openedDialog = false;
		this.conditionTypes = [];
		this.defaultType = '';
		this.conditionList = [];
	}

	render() {
		return html`
			<d2l-button-subtle
				@click="${this._openDialog}"
				id="add-enrollment-rule-button"
				text="${this.localize('addEnrollmentRuleButton')}"
				icon="tier1:lock-locked"></d2l-button-subtle>

			<condition-picker-dialog
				?opened="${this.opened}"
				@condition-picker-dialog-closed="${this._dialogClosed}"
				@condition-picker-conditions-changed="${this._ruleConditionsChanged}"
				.conditionList="${this.conditionList}"
				.conditionTypes="${this.conditionTypes}"
				defaultType="${this.defaultType}"></condition-picker-dialog>
		`;
	}

	_dialogClosed(e) {
		this.conditionList = e.detail.conditionList;
		this.opened = false;
	}

	_openDialog() {
		this.opened = true;
	}

}
window.customElements.define('add-rule-button', AddRuleButton);

