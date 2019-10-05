/* eslint-env mocha */
import { strictEqual } from 'assert';
import * as DOM from '../dist/index.mjs';

it('should match IDs', () =>
{
	const document = DOM.createHTMLDocument();
	const item = document.createElement('span');

	document.body.appendChild(item);

	item.id = 'hello';
	item.textContent = 'world';

	strictEqual(
		document.getElementById('hello'),
		item);
});
