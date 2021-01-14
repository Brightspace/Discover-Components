import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/button/button-subtle.js';
import '@brightspace-ui/core/components/dialog/dialog.js';
import '@brightspace-ui/core/components/inputs/input-text.js';
import './rule-picker.js';

import { css, html, LitElement } from 'lit-element/lit-element.js';
import { LocalizeElement } from '../locales/localize-element.js';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';

class RulePickerDialog extends LocalizeElement(RtlMixin(LitElement)) {
	static get properties() {
		return {
			dialogIsOpened : Boolean,
			conditionTypes : Array,
			defaultType: Array,
			conditionList : Object,
			_savedConditionList: Object
		};
	}

	static get styles() {
		return css`
			.d2l-rule-picker-area {
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
	}

	render() {
		return html`
			<d2l-button-subtle
				@click=${this._openDialog}
				id="add-enrollment-rule-button"
				text="${this.localize('addEnrollmentRuleButton')}"
				icon="tier1:lock-locked"></d2l-button-subtle>

			<d2l-dialog ?opened="${this.dialogIsOpened}" @d2l-dialog-close="${this._dialogClosed}" title-text="${this.localize('addEnrollmentRuleHeader')}">
				<div class="d2l-rule-picker-area">${this.localize('pickerSelectConditions')}</div>


				<rule-picker
					.conditionTypes="${this.conditionTypes}"
					defaultType="${this.defaultType}"
					@add-condition-pressed="${this._addConditionPressed}"
					>
				</rule-picker>

				<d2l-button id="dialog-cancel-button" @click="${this._dialogCancelPressed}" slot="footer" primary data-dialog-action="done">Done</d2l-button>
				<d2l-button id="dialog-done-button" @click="${this._dialogDonePressed}" slot="footer" data-dialog-action>Cancel</d2l-button>
			</d2l-dialog>
		`;
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

	_dialogCancelPressed() {
		this.conditionList = this._copyConditions(this._savedConditionList);
		this.requestUpdate().then(() => {
			const picker = this.shadowRoot.querySelector('rule-picker');
			picker.reload(this.conditionList);
		});
	}

	_dialogClosed() {
		this.dialogIsOpened = false;
	}

	_dialogDonePressed() {
		this._savedConditionList = this._copyConditions(this.conditionList);
		this.requestUpdate();
		this.dispatchEvent(new CustomEvent('rule-conditions-changed', {
			detail: { conditionList: this._copyConditions(this.conditionList) },
			bubbles: true,
			composed: true
		}));
	}

	_openDialog() {
		this.dialogIsOpened = true;
	}

	_saveConditions() {
		this._savedConditionList = this._copyConditions(this.conditionList);
	}
}

window.customElements.define('rule-picker-dialog', RulePickerDialog);
