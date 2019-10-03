import Node from './Node';
import { stringify } from './utils';

abstract class CharacterData extends Node
{
	private _data: string;

	public constructor(data: string)
	{
		super();
		this._data = data;
	}

	public get data()
	{
		return this._data;
	}

	public set data(value)
	{
		this._data = stringify(value, true);
	}

	public get length()
	{
		return this._data.length;
	}

	public get nodeValue()
	{
		return this._data;
	}

	public set nodeValue(value)
	{
		this._data = value;
	}

	public get textContent()
	{
		return this._data;
	}

	public appendData(data: string)
	{
		this._data += data;
	}

	public deleteData(offset: number, count: number)
	{
		this._data = this._data.slice(0, offset) + this._data.slice(offset + count);
	}

	public insertData(offset: number, data: string)
	{
		this._data = this._data.slice(0, offset) + data + this._data.slice(offset);
	}

	public replaceData(offset: number, count: number, data: string)
	{
		this._data = this._data.slice(0, offset) + data + this._data.slice(offset + count);
	}

	public substringData(offset: number, count: number)
	{
		return this._data.slice(offset, offset + count);
	}
}

export default CharacterData;
