import '../../Components/rule-picker-dialog.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

const conditionTypes = ['Apple', 'Banana', 'Orange', 'Potato', 'Colors', 'Numbers'];

const conditionListLong = `[{"type":"Apple", "value":"granny smith"}, {"type":"Banana", "value":"cavendish"}, {"type":"Banana", "value":"cavendish"}, {"type":"Banana", "value":"cavendish"},
							{"type":"Colors", "value":"Red"}, {"type":"Numbers", "value":"99"}, {"type":"Colors", "value":"Black"}, {"type":"Numbers", "value":"8"}]`;

describe('RulePickerDialog', () => {

	describe('accessibility', () => {
		it('should pass all aXe tests', async() => {
			const el = await fixture(html`<rule-picker-dialog></rule-picker-dialog>`);
			await expect(el).to.be.accessible();
		});
	});

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('rule-picker');
		});
	});

	describe('Done behaviour', () => {
		it('should output an event containing the updated condition data when the "Done" button has been pressed.', async() => {

			const el = await fixture(
				html`<rule-picker-dialog
					conditionList="${conditionListLong}"
					.conditionTypes="${conditionTypes}"
					defaultValue="${conditionTypes[0]}"></rule-picker-dialog>`
			);

			// returns either the event or the returnValIfTimeout, whichever is resolved first
			const timeout = 100;
			async function verifyEventTimeout(listener, returnValIfTimeout) {
				return await Promise.race([
					listener,
					new Promise(resolve => setTimeout(() => resolve(returnValIfTimeout), timeout))
				]);
			}

			const listener = oneEvent(el, 'rule-conditions-changed');

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
	});
});
