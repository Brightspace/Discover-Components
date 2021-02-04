import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/button/button-subtle.js';
import '@brightspace-ui/core/components/dialog/dialog.js';
import '@brightspace-ui/core/components/inputs/input-text.js';
import './condition-picker.js';

import { css, html, LitElement } from 'lit-element/lit-element.js';
import { LocalizeElement } from '../locales/localize-element.js';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';

/**
* A Dialog for a condition picker component. Allows for editing the conditions of a rule. Allows to save and cancel said changes via the dialog buttons.
* Builds on the d2l-dialog, can be opened via the same methods.
* @fires condition-picker-dialog-opened - Dispatched when the dialog is opened
* @fires condition-picker-dialog-closed - Dispatched with the action value when the dialog is closed for any reason.
*	returns detail.conditionList, an array containing the state of the conditions.
* @fires condition-picker-conditions-changed - Dispatched when the 'done' button is pressed to inform listeners that the conditions have been updated.
*	returns detail.conditionList, an array containing the new state of the conditions.
*/
class ConditionPickerDialog extends LocalizeElement(RtlMixin(LitElement)) {
	static get properties() {
		return {
			/**
			 * Whether the dialog should be open or not.
			 */
			opened : {
				type: Boolean,
			},
			/**
			 * The collection of conditions to be rendered by the condition picker.
			 * Each element is an object containing a .type and .value pair, representing the dropdown conditionType and the tag value.
			 */
			conditionList: {
				type: Array,
			},

			conditionTypes: {
				type: Array
			},
			defaultType: {
				type: String
			},
			_savedConditionList: {
				type: Array,
			},
		};
	}

	static get styles() {
		return css`
			.d2l-condition-picker-area {
				height: 100%;
			}
		`;
	}

	constructor() {
		super();
		this.conditionTypes = [];
		this.defaultType = '';
		this.conditionList = {};
		this._savedConditionList = {};
		this.opened = false;
	}

	//Save a copy of the original condition list in case of cancelling
	firstUpdated(changedProperties) {
		changedProperties.forEach((oldValue, propName) => {
			if (propName === 'conditionList') {
				this._savedConditionList = this._copyConditions(this.conditionList);
			}
		});
	}

	render() {
		return html`
			<d2l-dialog ?opened="${this.opened}" @d2l-dialog-close="${this._dialogClosed}" title-text="${this.localize('addEnrollmentRuleHeader')}">
				<div class="d2l-condition-picker-area">${this.localize('pickerSelectConditions')}</div>

				<condition-picker
					.conditionTypes="${this.conditionTypes}"
					.conditionList="${this.conditionList}"
					defaultType="${this.defaultType}"
					@add-condition-pressed="${this._addConditionPressed}"
					@condition-list-updated="${this._updateConditionsOnChange}"></condition-picker>

				<d2l-button id="dialog-done-button" @click="${this._dialogDonePressed}" slot="footer" primary data-dialog-action="done">Done</d2l-button>
				<d2l-button id="dialog-cancel-button" slot="footer" data-dialog-action>Cancel</d2l-button>
			</d2l-dialog>
		`;
	}

	async open() {
		this.opened = true;
		return await this.updateComplete;
	}

	_addConditionPressed() {
		const dialog = this.shadowRoot.querySelector('d2l-dialog');
		dialog.resize();
	}

	_cancelConditions() {
		this.conditionList = this._copyConditions(this._savedConditionList);
	}

	_copyConditions(originalList) {
		const newList = [];
		for (let x = 0; x < originalList.length; x++) {
			const condition = {};
			condition.type = originalList[x].type;
			condition.value = originalList[x].value;
			newList.push(condition);
		}
		return newList;
	}

	_dialogClosed() {
		this.conditionList = this._copyConditions(this._savedConditionList);
		this.requestUpdate();
		this.opened = false;
		this.dispatchEvent(new CustomEvent('condition-picker-dialog-closed', {
			detail: { conditionList: this._copyConditions(this.conditionList) },
			bubbles: true,
			composed: true
		}));
	}

	_dialogDonePressed() {
		this._savedConditionList = this._copyConditions(this.conditionList);
		this.requestUpdate();
		this.dispatchEvent(new CustomEvent('condition-picker-conditions-changed', {
			detail: { conditionList: this._copyConditions(this.conditionList) },
			bubbles: true,
			composed: true
		}));
		this._dialogClosed();
	}

	_saveConditions() {
		this._savedConditionList = this._copyConditions(this.conditionList);
	}

	_updateConditionsOnChange(e) {
		this.conditionList = e.detail.conditionList;
	}
}

window.customElements.define('condition-picker-dialog', ConditionPickerDialog);
