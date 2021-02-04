import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/button/button-subtle.js';
import '@brightspace-ui/core/components/dialog/dialog.js';
import '@brightspace-ui/core/components/inputs/input-text.js';

import { css, html, LitElement } from 'lit-element/lit-element.js';
import { bodyCompactStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { LocalizeElement } from '../locales/localize-element.js';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles.js';

class ConditionPicker extends LocalizeElement(RtlMixin(LitElement)) {

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
		};
	}

	static get styles() {
		return [ bodyCompactStyles, selectStyles,
			css`
				.d2l-condition-picker-container {
					align-items: center;
					display: flex;
					justify-content: center;

					margin-bottom: 1rem;
					margin-top: 1rem;
				}

				.d2l-condition-picker-input {
					flex-grow: 1;
				}

				.d2l-condition-picker-separator {
					margin: 0 0.5rem 0 0.5rem;
				}

				.d2l-condition-picker-and {
					display: flex;
					margin-bottom: 0.5rem;
				}

				.d2l-condition-picker-hr {
					align-self: center;
					border-bottom: 1px solid var(--d2l-color-mica);
					height: 0;
				}

				.d2l-condition-picker-hr-condition-separator {
					margin-left: 1rem;
					width: 100%;
				}

				.d2l-condition-picker-hr-match-separator {
					margin-bottom: 1rem;
					margin-top: 1rem;
				}

				[hidden] {
					display: none !important;
				}

			`,
		];
	}

	constructor() {
		super();
		this.conditionList = [];
	}

	render() {
		return html`
			${this._renderPickerConditions()}

			<d2l-button-subtle id="add-another-condition-button"
				text="${this.localize('addAnotherCondition')}"
				icon="tier1:plus-default"
				@click="${this._addNewCondition}"></d2l-button-subtle>

			<div class="d2l-condition-picker-hr-match-separator">
				<div class="d2l-condition-picker-hr"></div>
			</div>
		`;
	}

	updated(changedProperties) {
		changedProperties.forEach((oldValue, propName) => {
			if (propName === 'conditionList') {
				this._UpdateDropdownSelections();
				this._UpdateInputText();
			}
			else if (propName === 'defaultType') {
				if (this.conditionList.length === 0) {
					this._addNewCondition();
				}
			}
		});
	}

	_addNewCondition() {
		const condition = {};
		condition.type = this.defaultType;
		condition.value = '';
		this.conditionList.push(condition);

		this.dispatchEvent(new CustomEvent('add-condition-pressed', {
			bubbles: true,
			composed: true
		}));
		this.requestUpdate();
	}

	_conditionListUpdated() {
		this.dispatchEvent(new CustomEvent('condition-list-updated', {
			detail: {
				conditionList: this.conditionList
			},
			bubbles: true,
			composed: true
		}));
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

	_isLastCondition(condition) {
		return this.conditionList[this.conditionList.length - 1] === condition;
	}

	_isOnlyCondition() {
		return this.conditionList.length < 2;
	}

	_onConditionSelectChange(e) {
		const condition = e.target.condition;
		condition.type = e.target.value;
		this._conditionListUpdated();
		this.requestUpdate();
	}

	_onConditionValueChange(e) {
		const condition = e.target.condition;
		condition.value = e.target.value;
		this._conditionListUpdated();
	}

	_removeCondition(e) {
		const condition = e.target.condition;

		const index = this.conditionList.indexOf(condition);
		if (index > -1) {
			this.conditionList.splice(index, 1);
			this.requestUpdate();
		}

		this._UpdateDropdownSelections();
		this._UpdateInputText();
	}

	_renderPickerConditions() {
		return html`

		${this.conditionList.map(condition => html`
		<div class="d2l-condition-picker-container">
			<select class="d2l-input-select condition-picker-select"
				.condition='${condition}'
				@blur="${this._onConditionSelectChange}">
				${this.conditionTypes.map(conditionType => html`
					<option value="${conditionType}" ?selected="${condition.type === conditionType}">${conditionType}</option>
				`)}
			</select>

			<div class="d2l-condition-picker-separator d2l-body-compact">
				${this.localize('conditionIs')}
			</div>

			<d2l-input-text
				class="d2l-condition-picker-input"
				placeholder="Enter a condition value"
				.condition="${condition}"
				@blur="${this._onConditionValueChange}">
			</d2l-input-text>

			<d2l-button-icon
				id="delete-condition-button"
				?hidden=${this._isOnlyCondition()}
				text="${this.localize('removeCondition', 'conditionType', condition.type)}"
				icon="tier1:close-default"
				.condition="${condition}"
				@click="${this._removeCondition}"></d2l-button-icon>
		</div>
		<div class="d2l-condition-picker-and d2l-body-compact" .condition="${condition}" ?hidden="${this._isLastCondition(condition)}">
			${this.localize('and')}
			<div class="d2l-condition-picker-hr d2l-condition-picker-hr-condition-separator"></div>
		</div>`)}`;
	}

	_UpdateDropdownSelections() {
		const dropdowns = this.shadowRoot.querySelectorAll('.condition-picker-select');
		for (let x = 0; x < this.conditionList.length; x++) {
			dropdowns[x].value = this.conditionList[x].type;
		}
	}

	_UpdateInputText() {
		const inputs = this.shadowRoot.querySelectorAll('.d2l-condition-picker-input');
		for (let x = 0; x < this.conditionList.length; x++) {
			inputs[x].value = this.conditionList[x].value;
		}
	}
}

window.customElements.define('condition-picker', ConditionPicker);
