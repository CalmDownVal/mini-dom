import Mixin from './Mixin.mjs';
import { isElement } from '../utils.mjs';

function filterDescendants(element, filter, list)
{
	for (const child of element.children)
	{
		if (filter(child))
		{
			list.push(child);
		}
		filterDescendants(child, filter, list);
	}
}

export default Mixin(T => class extends T
{
	get childElementCount()
	{
		let count = 0;
		for (const node of this.childNodes)
		{
			if (isElement(node))
			{
				++count;
			}
		}
		return count;
	}

	get children()
	{
		return this.childNodes.filter(isElement);
	}

	get firstElementChild()
	{
		return this.childNodes.find(isElement) || null;
	}

	get lastElementChild()
	{
		// can't use .find here as we need to search from the end
		const length = this.childNodes.length;
		for (let i = length - 1; i !== 0; --i)
		{
			const node = this.childNodes[i];
			if (isElement(node))
			{
				return node;
			}
		}
		return null;
	}

	get parentElement()
	{
		return this.parentNode && isElement(this.parentNode) ? this.parentNode : null;
	}

	getElementsByClassName(className)
	{
		const list = [];
		filterDescendants(this, node => node.classList.contains(className), list);
		return list;
	}

	getElementsByTagName(tagName)
	{
		const list = [];
		filterDescendants(this, node => node.tagName === tagName, list);
		return list;
	}

	getElementsByTagNameNS(namespaceURI, localName)
	{
		// TODO
	}

	querySelector(selector)
	{
		// TODO
	}

	querySelectorAll(selector)
	{
		// TODO
	}
});
