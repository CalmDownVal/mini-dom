import { stringify } from './utils.mjs';

export default class Attr
{
	#localName;
	#namespaceURI = null;
	#ownerElement = null;
	#prefix = null;
	#value;

	constructor(localName)
	{
		this.localName = localName;
	}

	get localName()
	{
		return this.#localName;
	}

	set localName(value)
	{
		this.#localName = stringify(value, false, false);
	}

	get namespaceURI()
	{
		return this.#namespaceURI;
	}

	set namespaceURI(value)
	{
		this.#namespaceURI = stringify(value, true, true);
	}

	get name()
	{
		return this.#namespaceURI ? `${this.#prefix || 'ns'}:${this.#localName}` : this.#localName;
	}

	get ownerElement()
	{
		return this.#ownerElement;
	}

	get prefix()
	{
		return this.#prefix;
	}

	set prefix(value)
	{
		this.#prefix = stringify(value, false, true);
	}

	get value()
	{
		return this.#value;
	}

	set value(value)
	{
		this.#value = stringify(value, true, false);
	}

	static _setOwnerElement(attr, newOwnerElement)
	{
		attr.#ownerElement = newOwnerElement;
	}
}
