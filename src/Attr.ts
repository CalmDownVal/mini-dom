import Element from './Element';
import INamespaceMember from './interfaces/INamespaceMember';
import { stringify, stringifyNull } from './utils';

class Attr implements INamespaceMember
{
	public static setOwnerElement(attr: Attr, newOwnerElement: Element | null)
	{
		attr._ownerElement = newOwnerElement;
	}

	private _localName: string;
	private _namespaceURI: string | null = null;
	private _ownerElement: Element | null = null;
	private _prefix: string | null = null;
	private _value: string;

	public constructor(localName: string, value: string = '')
	{
		this._localName = localName;
		this._value = value;
	}

	public get localName()
	{
		return this._localName;
	}

	public set localName(value)
	{
		this._localName = stringify(value);
	}

	public get namespaceURI()
	{
		return this._namespaceURI;
	}

	public set namespaceURI(value)
	{
		this._namespaceURI = stringifyNull(value, true);
	}

	public get name()
	{
		return this._prefix && this._namespaceURI ? `${this._prefix}:${this._localName}` : this._localName;
	}

	public get ownerElement()
	{
		return this._ownerElement;
	}

	public get prefix()
	{
		return this._prefix;
	}

	public set prefix(value)
	{
		this._prefix = stringifyNull(value);
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
