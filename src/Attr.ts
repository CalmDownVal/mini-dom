import Element from './Element';
import INamespaceMember from './interfaces/INamespaceMember';
import { splitName, stringify } from './utils';

class Attr implements INamespaceMember
{
	public static create(qualifiedName: string)
	{
		return new Attr(qualifiedName);
	}

	public static createNS(namespaceURI: string | null, qualifiedName: string)
	{
		const parts = splitName(qualifiedName);
		const attr = new Attr(parts[1]!);
		attr._prefix = parts[0];
		attr._namespaceURI = namespaceURI;
		return attr;
	}

	public static setOwnerElement(attr: Attr, newOwnerElement: Element | null)
	{
		attr._ownerElement = newOwnerElement;
	}

	private _localName: string;
	private _namespaceURI: string | null = null;
	private _ownerElement: Element | null = null;
	private _prefix: string | null = null;
	private _value: string = '';

	private constructor(localName: string)
	{
		this._localName = localName;
	}

	public get localName()
	{
		return this._localName;
	}

	public get namespaceURI()
	{
		return this._namespaceURI;
	}

	public get name()
	{
		return this._prefix ? `${this._prefix}:${this._localName}` : this._localName;
	}

	public get ownerElement()
	{
		return this._ownerElement;
	}

	public get prefix()
	{
		return this._prefix;
	}

	public get value()
	{
		return this._value;
	}

	public set value(newValue)
	{
		const oldValue = this._value;
		newValue = stringify(newValue, true);
		if (oldValue !== newValue)
		{
			this._value = newValue;
			Element.notifyAttributeChanged(this, oldValue, newValue);
		}
	}
}

export default Attr;
