import Element from './Element';
import Node from './Node';
import { isElement } from './utils';

function filterDescendants(node: Node, filter: (elem: Element) => boolean, list: Element[] = [])
{
	for (const child of node.childNodes)
	{
		if (isElement(child))
		{
			if (filter(child as Element))
			{
				list.push(child as Element);
			}
			filterDescendants(child, filter, list);
		}
	}
	return list;
}

abstract class DocumentOrElement extends Node
{
	public get childElementCount()
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

	public get children()
	{
		return this.childNodes.filter(isElement) as any as Element[];
	}

	public get firstElementChild()
	{
		return this.childNodes.find(isElement) || null;
	}

	public get lastElementChild()
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

	public getElementsByClassName(className: string)
	{
		return filterDescendants(this, (elem) => elem.classList.contains(className));
	}

	public getElementsByTagName(tagName: string)
	{
		return filterDescendants(this, (elem) => elem.tagName === tagName);
	}

	public getElementsByTagNameNS(namespaceURI: string | null, localName: string)
	{
		return filterDescendants(this, (elem) => elem.namespaceURI === namespaceURI && elem.localName === localName);
	}

	public querySelector(selector: string): Element | null
	{
		// TODO
		return null;
	}

	public querySelectorAll(selector: string): Element[]
	{
		// TODO
		return [];
	}
}

export default DocumentOrElement;
