import Node from './Node.mjs';
import { stringify } from './utils.mjs';

/**
 * @abstract
 */
export default class CharacterData extends Node
{
	#data;

	get data()
	{
		return this.#data;
	}

	set data(value)
	{
		this.#data = stringify(value, true, false);
	}

	get length()
	{
		this.#data.length;
	}

	get nodeValue()
	{
		return this.#data;
	}

	set nodeValue(value)
	{
		this.data = value;
	}

	get textContent()
	{
		return this.#data;
	}

	appendData(data)
	{
		this.#data += data;
	}

	deleteData(offset, count)
	{
		this.#data = this.#data.slice(0, offset) + this.#data.slice(offset + count);
	}

	insertData(offset, data)
	{
		this.#data = this.#data.slice(0, offset) + data + this.#data.slice(offset);
	}

	replaceData(offset, count, data)
	{
		this.#data = this.#data.slice(0, offset) + data + this.#data.slice(offset + count);
	}

	substringData(offset, count)
	{
		return this.#data.slice(offset, offset + count);
	}
}
