import Element from './Element';

const RE_WS = /\s+/g;

class ClassList
{
	private list: Set<string> = new Set();
	private owner: Element;
	private skipUpdate: boolean = false;

	constructor(owner: Element)
	{
		this.owner = owner;
	}

	public [Symbol.iterator]()
	{
		return this.list[Symbol.iterator]();
	}

	public add(token: string)
	{
		if (!this.list.has(token))
		{
			this.list.add(token);
			this.onChange();
		}
	}

	public contains(token: string)
	{
		return this.list.has(token);
	}

	public parse(str: string | null)
	{
		if (this.skipUpdate)
		{
			return;
		}

		let anchor = 0;
		let match;

		this.list.clear();
		if (!str)
		{
			return;
		}

		RE_WS.lastIndex = 0;

		// tslint:disable-next-line:no-conditional-assignment
		while ((match = RE_WS.exec(str)))
		{
			if (anchor < match.index)
			{
				this.list.add(str.slice(anchor, match.index));
			}
			anchor = match.index + match[0].length;
		}

		if (anchor !== str.length)
		{
			this.list.add(str.slice(anchor));
		}
	}

	public remove(token: string)
	{
		const result = this.list.delete(token);
		if (result)
		{
			this.onChange();
		}
		return result;
	}

	public toggle(token: string, force?: boolean)
	{
		const has = this.list.has(token);
		if (force !== has)
		{
			if (force === undefined)
			{
				force = !has;
			}

			if (force)
			{
				this.list.add(token);
			}
			else
			{
				this.list.delete(token);
			}

			this.onChange();
		}
		return force;
	}

	public toString()
	{
		let str = '';
		for (const token of this.list)
		{
			str += str ? ' ' + token : token;
		}
		return str;
	}

	private onChange()
	{
		this.skipUpdate = true;
		this.owner.setAttribute('class', this.toString() || null);
		this.skipUpdate = false;
	}
}

export default ClassList;
