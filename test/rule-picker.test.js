import '../Components/rule-picker.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

const conditionTypes = ['Apple', 'Banana', 'Orange', 'Potato', 'Colors', 'Numbers'];

const conditionList = '[{"type":"Apple", "value":"granny smith"},{"type":"Banana", "value":"cavendish"}]';

const conditionListLong = `[{"type":"Apple", "value":"granny smith"}, {"type":"Banana", "value":"cavendish"}, {"type":"Banana", "value":"cavendish"}, {"type":"Banana", "value":"cavendish"},
							{"type":"Colors", "value":"Red"}, {"type":"Numbers", "value":"99"}, {"type":"Colors", "value":"Black"}, {"type":"Numbers", "value":"8"}]`;

const conditionListObj = JSON.parse(conditionList);

describe('RulePicker', () => {

	describe('accessibility', () => {
		it('should pass all aXe tests', async() => {
			const el = await fixture(html`<rule-picker></rule-picker>`);
			await expect(el).to.be.accessible();
		});
	});

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('rule-picker');
		});
	});

	describe('render', () => {
		it('should render the conditionType dropdown data correctly', async() => {
			const el = await fixture(
				html`<rule-picker
					conditionList="${conditionList}"
					.conditionTypes="${conditionTypes}"></rule-picker>`
			);

			const conditionDropdown = el.shadowRoot.querySelector('select');
			const conditionInput = el.shadowRoot.querySelector('d2l-input-text');

			expect(conditionDropdown).to.not.be.null;
			expect(conditionInput).to.not.be.null;
			expect(conditionDropdown.options.length).to.equal(conditionTypes.length);

			for (let x = 0 ; x < conditionDropdown.options; x++) {
				expect(conditionDropdown.options[x]).to.equal(conditionTypes[x]);
			}

		});

		it('should render the initialized condition data', async() => {
			const el = await fixture(
				html`<rule-picker
					conditionList="${conditionList}"
					.conditionTypes="${conditionTypes}"></rule-picker>`
			);

			const conditionDropdownList = el.shadowRoot.querySelectorAll('select');
			const conditionInputList = el.shadowRoot.querySelectorAll('d2l-input-text');

			//Ensure there is the correct amount of dropdowns and inputs
			expect(conditionDropdownList.length).to.equal(conditionListObj.length);
			expect(conditionInputList.length).to.equal(conditionListObj.length);

			//Ensure the data in the fields lines up with the passed data
			for (let x = 0 ; x < conditionDropdownList.options; x++) {
				expect(conditionDropdownList[x].value).to.equal(conditionListObj[x].type);
				expect(conditionInputList[x].value).to.equal(conditionListObj[x].value);
			}
		});

		it('should should display one empty condition by default', async() => {
			const el = await fixture(
				html`<rule-picker
					.conditionTypes="${conditionTypes}"
					defaultType="${conditionTypes[1]}"></rule-picker>`
			);

			const conditionDropdownList = el.shadowRoot.querySelectorAll('select');
			const conditionInputList = el.shadowRoot.querySelectorAll('d2l-input-text');

			expect(conditionDropdownList.length).to.equal(1);
			expect(conditionInputList.length).to.equal(1);
		});
	});

	describe('interaction', () => {
		it('should add a new condition when the Add Condition button is pressed', async() => {
			const el = await fixture(
				html`<rule-picker
					.conditionTypes="${conditionTypes}"
					defaultType="${conditionTypes[1]}"></rule-picker>`
			);
			const addButton = el.shadowRoot.querySelector('#add-another-condition-button');
			addButton.click();
			await el.updateComplete;

			const conditionDropdownList = el.shadowRoot.querySelectorAll('select');
			const conditionInputList = el.shadowRoot.querySelectorAll('d2l-input-text');
			expect(conditionDropdownList.length).to.equal(2);
			expect(conditionInputList.length).to.equal(2);
		});

		it('updates the condition information when the combo is modified and loses focus', async() => {
			const el = await fixture(
				html`<rule-picker
					conditionList="${conditionList}"
					.conditionTypes="${conditionTypes}"></rule-picker>`
			);

			const conditionD2LInput = el.shadowRoot.querySelector('d2l-input-text');
			await conditionD2LInput.updateComplete;
			const conditionInput = conditionD2LInput.shadowRoot.querySelector('input');

			const listener = oneEvent(conditionInput, 'blur');

			conditionInput.focus();
			conditionD2LInput.value = 'Zebra';
			conditionInput.blur();

			await listener;

			expect(el.conditionList[0].value).to.equal('Zebra');
		});

		it('updates the condition information when the input field is modified', async() => {
			const el = await fixture(
				html`<rule-picker
					conditionList="${conditionList}"
					.conditionTypes="${conditionTypes}"
					defaultValue="${conditionTypes[0]}"></rule-picker>`
			);

			expect(el.conditionList[0].type).to.equal(conditionTypes[0]);

			const conditionSelect = el.shadowRoot.querySelector('select');
			const listener = oneEvent(conditionSelect, 'blur');

			conditionSelect.focus();
			conditionSelect.value = conditionTypes[1];
			conditionSelect.blur();

			await listener;

			expect(el.conditionList[0].type).to.equal(conditionTypes[1]);
		});

		it('should display the condition deletion button only if there is greater than one condition', async() => {
			const el = await fixture(
				html`<rule-picker
					.conditionTypes="${conditionTypes}"
					defaultValue="${conditionTypes[0]}"></rule-picker>`
			);

			let deleteButtonList = el.shadowRoot.querySelectorAll('#delete-condition-button');
			expect(deleteButtonList.length).to.be.equal(0);

			const addButton = el.shadowRoot.querySelector('#add-another-condition-button');
			addButton.click();
			await el.updateComplete;

			deleteButtonList = el.shadowRoot.querySelectorAll('#delete-condition-button');
			expect(deleteButtonList.length).to.be.equal(1);
		});

		describe('Done and cancel behaviour', () => {
			const originalConditionList = conditionListObj;
			let el;

			beforeEach(async() => {
				el = await fixture(
					html`<rule-picker
						conditionList="${conditionListLong}"
						.conditionTypes="${conditionTypes}"
						defaultValue="${conditionTypes[0]}"></rule-picker>`
				);

				//Add a new condition
				const addButton = el.shadowRoot.querySelector('#add-another-condition-button');
				addButton.click();
				await el.updateComplete;

				//Delete the first condition
				const deleteButton = el.shadowRoot.querySelector('#delete-condition-button');
				deleteButton.click();

				//Edit a dropdown
				const conditionSelect = el.shadowRoot.querySelector('select');
				const dropdownListener = oneEvent(conditionSelect, 'blur');
				conditionSelect.focus();
				conditionSelect.value = conditionTypes[1];
				conditionSelect.blur();
				await dropdownListener;

				//Edit an input
				const conditionD2LInput = el.shadowRoot.querySelector('d2l-input-text');
				await conditionD2LInput.updateComplete;
				const conditionInput = conditionD2LInput.shadowRoot.querySelector('input');
				const inputListener = oneEvent(conditionInput, 'blur');
				conditionInput.focus();
				conditionD2LInput.value = 'Zebra';
				conditionInput.blur();
				await inputListener;
			});

			it('should revert any changes to condition data when "Cancel" button has been pressed.', async() => {
				//Cancel all changes
				const cancelButton = el.shadowRoot.querySelector('.page-cancel-button');
				cancelButton.click();
				await el.updateComplete;

				//Confirm that the data matches the original data before any modification
				const conditionDropdownList = el.shadowRoot.querySelectorAll('select');
				const conditionInputList = el.shadowRoot.querySelectorAll('d2l-input-text');
				const listData = el.conditionList;

				for (let x = 0 ; x < originalConditionList.length; x++) {
					//Ensure user facing data matches expected results
					expect(conditionDropdownList[x].value).to.equal(originalConditionList[x].type);
					expect(conditionInputList[x].value).to.equal(originalConditionList[x].value);

					//Ensure internal component data matches expected results
					expect(listData[x].type).to.equal(originalConditionList[x].type);
					expect(listData[x].value).to.equal(originalConditionList[x].value);
				}
			});

			it('should save any changes to condition data when "Done" button has been pressed. Cancel should then revert to the last Done state.', async() => {
				//Save all changes
				const doneButton = el.shadowRoot.querySelector('.page-done-button');
				doneButton.click();
				const savedData = el._savedConditionList;
				await el.updateComplete;

				//Cancel any potential changes
				const cancelButton = el.shadowRoot.querySelector('.page-cancel-button');
				cancelButton.click();
				await el.updateComplete;

				//Confirm that pressing cancel did not revert anything
				const conditionDropdownList = el.shadowRoot.querySelectorAll('select');
				const conditionInputList = el.shadowRoot.querySelectorAll('d2l-input-text');
				const listData = el.conditionList;

				for (let x = 0 ; x < originalConditionList.length; x++) {
					//Ensure user facing data matches expected results
					expect(conditionDropdownList[x].value).to.equal(savedData[x].type);
					expect(conditionInputList[x].value).to.equal(savedData[x].value);

					//Ensure internal component data matches expected results
					expect(listData[x].type).to.equal(savedData[x].type);
					expect(listData[x].value).to.equal(savedData[x].value);
				}
			});

			it('should output an event containing the updated condition data when the "Done" button has been pressed.', async() => {

				// returns either the event or the returnValIfTimeout, whichever is resolved first
				const timeout = 100;
				async function verifyEventTimeout(listener, returnValIfTimeout) {
					return await Promise.race([
						listener,
						new Promise(resolve => setTimeout(() => resolve(returnValIfTimeout), timeout))
					]);
				}

				const listener = oneEvent(el, 'rule-conditions-changed');

				const doneButton = el.shadowRoot.querySelector('.page-done-button');
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

	describe('deletion', () => {
		let el;
		let deleteButtonList;
		beforeEach(async() => {
			el = await fixture(
				html`<rule-picker
					conditionList="${conditionListLong}"
					.conditionTypes="${conditionTypes}"
					defaultValue="${conditionTypes[0]}"></rule-picker>`
			);

			deleteButtonList = el.shadowRoot.querySelectorAll('#delete-condition-button');
		});

		it('should correctly display the condition information when the first condition has been deleted.', async() => {
			const firstDeleted = JSON.parse(conditionListLong);
			firstDeleted.splice(0, 1);

			deleteButtonList[0].click();
			await el.updateComplete;

			const conditionDropdownList = el.shadowRoot.querySelectorAll('select');
			const conditionInputList = el.shadowRoot.querySelectorAll('d2l-input-text');
			const listData = el.conditionList;

			for (let x = 0 ; x < firstDeleted.length; x++) {
				//Ensure user facing data matches expected results
				expect(conditionDropdownList[x].value).to.equal(firstDeleted[x].type);
				expect(conditionInputList[x].value).to.equal(firstDeleted[x].value);

				//Ensure internal component data matches expected results
				expect(listData[x].type).to.equal(firstDeleted[x].type);
				expect(listData[x].value).to.equal(firstDeleted[x].value);
			}
		});

		it('should correctly display the condition information when the last condition has been deleted.', async() => {
			const lastDeleted = JSON.parse(conditionListLong);
			lastDeleted.splice(lastDeleted.length - 1, 1);

			deleteButtonList[deleteButtonList.length - 1].click();
			await el.updateComplete;

			const conditionDropdownList = el.shadowRoot.querySelectorAll('select');
			const conditionInputList = el.shadowRoot.querySelectorAll('d2l-input-text');
			const listData = el.conditionList;

			for (let x = 0 ; x < lastDeleted.length; x++) {
				//Ensure user facing data matches expected results
				expect(conditionDropdownList[x].value).to.equal(lastDeleted[x].type);
				expect(conditionInputList[x].value).to.equal(lastDeleted[x].value);

				//Ensure internal component data matches expected results
				expect(listData[x].type).to.equal(lastDeleted[x].type);
				expect(listData[x].value).to.equal(lastDeleted[x].value);
			}
		});

		it('should correctly display the condition information when the middle condition has been deleted.', async() => {
			const middleDeleted = JSON.parse(conditionListLong);
			middleDeleted.splice(middleDeleted.length / 2);

			deleteButtonList[deleteButtonList.length / 2].click();
			await el.updateComplete;

			const conditionDropdownList = el.shadowRoot.querySelectorAll('select');
			const conditionInputList = el.shadowRoot.querySelectorAll('d2l-input-text');
			const listData = el.conditionList;

			for (let x = 0 ; x < middleDeleted.length; x++) {
				//Ensure user facing data matches expected results
				expect(conditionDropdownList[x].value).to.equal(middleDeleted[x].type);
				expect(conditionInputList[x].value).to.equal(middleDeleted[x].value);

				//Ensure internal component data matches expected results
				expect(listData[x].type).to.equal(middleDeleted[x].type);
				expect(listData[x].value).to.equal(middleDeleted[x].value);
			}
		});
	});
});
