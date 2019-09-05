const RE_WS = /\s+/g;

export default class ClassList
{
	#list;

	constructor(iterable)
	{
		this.#list = new Set(iterable);
	}

	[Symbol.iterator]()
	{
		return this.#list[Symbol.iterator]();
	}

	add(token)
	{
		this.#list.add(token);
	}

	remove(token)
	{
		return this.#list.delete(token);
	}

	toggle(token, force)
	{
		if (typeof force !== 'boolean')
		{
			force = !this.#list.has(token);
		}

		force
			? this.#list.add(token)
			: this.#list.delete(token);

		return force;
	}

	contains(token)
	{
		return this.#list.has(token);
	}

	_stringify()
	{
		let str = '';
		for (const token of this.#list)
		{
			str += str ? ' ' + token : token;
		}
		return str;
	}

	_parse(str)
	{
		let anchor = 0;
		let match;

		this.#list.clear();
		RE_WS.lastIndex = 0;
		while ((match = RE_WS.exec(str)))
		{
			if (anchor < match.index)
			{
				this.#list.add(str.slice(anchor, match.index));
			}
			anchor = match.index + match[0].length;
		}

		if (anchor !== str.length)
		{
			this.#list.add(str.slice(anchor));
		}
	}
}
