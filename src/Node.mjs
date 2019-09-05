function isElement(node)
{
	return node.nodeType === Node.ELEMENT_NODE;
}

/**
 * @abstract
 */
export default class Node
{
	static ELEMENT_NODE = 1;
	static TEXT_NODE = 3;
	static CDATA_SECTION_NODE = 4;
	static PROCESSING_INSTRUCTION_NODE = 7;
	static COMMENT_NODE = 8;
	static DOCUMENT_NODE = 9;
	static DOCUMENT_TYPE_NODE = 10;

	#childNodes = [];
	#children = null;
	#document = null;
	#nextSibling = null;
	#parentNode = null;
	#previousSibling = null;

	// abstract get nodeName
	// abstract get nodeType

	get childElementCount()
	{
		return this.children.length;
	}

	get childNodes()
	{
		return this.#childNodes;
	}

	get children()
	{
		return this.#children || (this.#children = this.#childNodes.filter(isElement));
	}

	get document()
	{
		if (!this.#document && this.#parentNode)
		{
			this.#document = this.#parentNode.document;
		}
		return this.#document;
	}

	get nextElementSibling()
	{
		let sibling = this.#nextSibling;
		while (sibling && !isElement(sibling))
		{
			sibling = sibling.#nextSibling;
		}
		return sibling;
	}

	get nextSibling()
	{
		return this.#nextSibling;
	}

	get nodeValue()
	{
		return null;
	}

	get parentElement()
	{
		return this.#parentNode && isElement(this.#parentNode) ? this.#parentNode : null;
	}

	get parentNode()
	{
		return this.#parentNode;
	}

	get previousElementSibling()
	{
		let sibling = this.#previousSibling;
		while (sibling && !isElement(sibling))
		{
			sibling = sibling.#previousSibling;
		}
		return sibling;
	}

	get previousSibling()
	{
		return this.#previousSibling;
	}

	get firstChild()
	{
		return this.#childNodes.length === 0 ? null : this.#childNodes[0];
	}

	get firstElementChild()
	{
		return this.#childNodes.find(isElement) || null;
	}

	get lastChild()
	{
		const length = this.#childNodes.length;
		return length === 0 ? null : this.#childNodes[length - 1];
	}

	get lastElementChild()
	{
		// can't use .find here as we need to search from the end
		const length = this.#childNodes.length;
		for (let i = length - 1; i !== 0; --i)
		{
			const node = this.#childNodes[i];
			if (isElement(node))
			{
				return node;
			}
		}
		return null;
	}

	appendChild(newChild)
	{
		this.#assertSupportsChildren();

		newChild.#document = this.#document;
		newChild.#parentNode = this;
		newChild.#nextSibling = null;

		const length = this.#childNodes.length;
		if (length !== 0)
		{
			const previous = this.#childNodes[length - 1];
			newChild.#previousSibling = previous;
			previous.#nextSibling = newChild;
		}
		else
		{
			newChild.#previousSibling = null;
		}

		this.#childNodes.push(newChild);
		this.#children = null;
		newChild._onConnected();
		return newChild;
	}

	insertBefore(newChild, refChild)
	{
		this.#assertSupportsChildren();

		if (refChild === null)
		{
			return this.appendChild(newChild);
		}

		const index = this.#childNodes.indexOf(refChild);
		if (index === -1)
		{
			throw new Error('refChild tis not a child of this Node.');
		}

		newChild.#document = this.#document;
		newChild.#parentNode = this;
		if (index !== 0)
		{
			const previous = this.#childNodes[index - 1];
			newChild.#previousSibling = previous;
			previous.#nextSibling = newChild;
		}
		else
		{
			newChild.#previousSibling = null;
		}

		newChild.#nextSibling = refChild;
		refChild.#previousSibling = newChild;
		this.#childNodes.splice(index, 0, newChild);
		this.#children = null;
		newChild._onConnected();
		return newChild;
	}

	removeChild(oldChild)
	{
		this.#assertSupportsChildren();

		const index = this.#childNodes.indexOf(oldChild);
		if (index === -1)
		{
			throw new Error('The node to be removed is not a child of this Node.');
		}

		oldChild.#document =
		oldChild.#parentNode =
		oldChild.#nextSibling =
		oldChild.#previousSibling = null;
		this.#childNodes.splice(index, 1);
		this.#children = null;

		if (index === 0)
		{
			if (index !== this.#childNodes.length)
			{
				this.#childNodes[index].#previousSibling = null;
			}
		}
		else
		{
			const previous = this.#childNodes[index - 1];
			if (index === this.#childNodes.length)
			{
				previous.#nextSibling = null;
			}
			else
			{
				const next = this.#childNodes[index];
				previous.#nextSibling = next;
				next.#previousSibling = previous;
			}
		}

		oldChild._onDisconnected();
		return oldChild;
	}

	_onConnected()
	{
		this.connectedCallback && this.connectedCallback();
	}

	_onDisconnected()
	{
		this.disconnectedCallback && this.disconnectedCallback();
	}

	// FUTURE: use private method syntax
	#assertSupportsChildren = () =>
	{
		if (this.constructor.supportsChildren !== true)
		{
			throw new Error('This Node does not support children.');
		}
	}
}
