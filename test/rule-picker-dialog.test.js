import '../components/condition-picker-dialog.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

const conditionTypes = ['Apple', 'Banana', 'Orange', 'Potato', 'Colors', 'Numbers'];

const conditionListLong = `[{"type":"Apple", "value":"granny smith"}, {"type":"Banana", "value":"cavendish"}, {"type":"Banana", "value":"cavendish"}, {"type":"Banana", "value":"cavendish"},
							{"type":"Colors", "value":"Red"}, {"type":"Numbers", "value":"99"}, {"type":"Colors", "value":"Black"}, {"type":"Numbers", "value":"8"}]`;

describe('conditionPickerDialog', () => {

	describe('accessibility', () => {
		it('should pass all aXe tests', async() => {
			const el = await fixture(html`<condition-picker-dialog></condition-picker-dialog>`);
			await expect(el).to.be.accessible();
		});
	});

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('condition-picker');
		});
	});

	describe('Button behaviour', () => {
		it('should output an event containing the updated condition data when the "Done" button has been pressed.', async() => {

			const el = await fixture(
				html`<condition-picker-dialog
					conditionList="${conditionListLong}"
					.conditionTypes="${conditionTypes}"
					defaultValue="${conditionTypes[0]}"></condition-picker-dialog>`
			);

			// returns either the event or the returnValIfTimeout, whichever is resolved first
			const timeout = 100;
			async function verifyEventTimeout(listener, returnValIfTimeout) {
				return await Promise.race([
					listener,
					new Promise(resolve => setTimeout(() => resolve(returnValIfTimeout), timeout))
				]);
			}

			const listener = oneEvent(el, 'condition-picker-conditions-changed');

			const doneButton = el.shadowRoot.querySelector('#dialog-done-button');
			doneButton.click();
			const result = await verifyEventTimeout(listener, 'no event fired');
			await el.updateComplete;
			expect(result).not.to.equal('no event fired');

			const savedData = el._savedConditionList;
			//Ensure the event data is equal to the saved data
			expect(result.detail.conditionList).to.not.be.null;
			for (let x = 0 ; x < savedData.length; x++) {
				//Ensure user facing data matches expected results
				expect(savedData[x].type).to.equal(result.detail.conditionList[x].type);
				expect(savedData[x].value).to.equal(result.detail.conditionList[x].value);
			}
		});

		it('should output an event containing the original condition data when the "Cancel" button has been pressed.', async() => {
			const el = await fixture(
				html`<condition-picker-dialog
						conditionList="${conditionListLong}"
						.conditionTypes="${conditionTypes}"
						defaultValue="${conditionTypes[0]}">
					</condition-picker-dialog>`
			);
			// returns either the event or the returnValIfTimeout, whichever is resolved first
			const timeout = 100;
			async function verifyEventTimeout(listener, returnValIfTimeout) {
				return await Promise.race([
					listener,
					new Promise(resolve => setTimeout(() => resolve(returnValIfTimeout), timeout))
				]);
			}

			const openListener = oneEvent(el, 'd2l-dialog-open');
			await el.open();
			const openResult = await verifyEventTimeout(openListener, 'no open event fired');
			expect(openResult).not.to.equal('no open event fired');

			const listener = oneEvent(el, 'condition-picker-dialog-closed');
			const cancelButton = el.shadowRoot.querySelector('#dialog-cancel-button');
			cancelButton.click();
			const result = await verifyEventTimeout(listener, 'no event fired');
			await el.updateComplete;
			expect(result).not.to.equal('no event fired');

			const savedData = el._savedConditionList;
			//Ensure the event data is equal to the original data
			expect(result.detail.conditionList).to.not.be.null;
			for (let x = 0 ; x < savedData.length; x++) {
				//Ensure user facing data matches expected results
				expect(savedData[x].type).to.equal(result.detail.conditionList[x].type);
				expect(savedData[x].value).to.equal(result.detail.conditionList[x].value);
			}
		});

		it('should output an event containing the original condition data when the "X" button has been pressed.', async() => {
			const el = await fixture(
				html`<condition-picker-dialog
						conditionList="${conditionListLong}"
						.conditionTypes="${conditionTypes}"
						defaultValue="${conditionTypes[0]}">
					</condition-picker-dialog>`
			);
			// returns either the event or the returnValIfTimeout, whichever is resolved first
			const timeout = 100;
			async function verifyEventTimeout(listener, returnValIfTimeout) {
				return await Promise.race([
					listener,
					new Promise(resolve => setTimeout(() => resolve(returnValIfTimeout), timeout))
				]);
			}

			const openListener = oneEvent(el, 'd2l-dialog-open');
			await el.open();
			const openResult = await verifyEventTimeout(openListener, 'no open event fired');
			expect(openResult).not.to.equal('no open event fired');

			const listener = oneEvent(el, 'condition-picker-dialog-closed');
			const dialog = el.shadowRoot.querySelector('d2l-dialog');
			const closeButton = dialog.shadowRoot.querySelector('d2l-button-icon');
			closeButton.click();
			const result = await verifyEventTimeout(listener, 'no event fired');
			await el.updateComplete;
			expect(result).not.to.equal('no event fired');

			const savedData = el._savedConditionList;
			//Ensure the event data is equal to the original data
			expect(result.detail.conditionList).to.not.be.null;
			for (let x = 0 ; x < savedData.length; x++) {
				//Ensure user facing data matches expected results
				expect(savedData[x].type).to.equal(result.detail.conditionList[x].type);
				expect(savedData[x].value).to.equal(result.detail.conditionList[x].value);
			}
		});
	});
});
