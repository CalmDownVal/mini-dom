import NotImplementedError from './NotImplementedError.mjs';

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
	#nextSibling = null;
	#ownerDocument = null;
	#parentNode = null;
	#previousSibling = null;
	#isConnected = false;

	get childNodes()
	{
		return this.#childNodes;
	}

	get firstChild()
	{
		return this.#childNodes.length === 0 ? null : this.#childNodes[0];
	}

	get isConnected()
	{
		return Boolean(this.ownerDocument);
	}

	get lastChild()
	{
		const length = this.#childNodes.length;
		return length === 0 ? null : this.#childNodes[length - 1];
	}

	get nextSibling()
	{
		return this.#nextSibling;
	}

	/**
	 * @abstract
	 */
	get nodeName()
	{
		throw new NotImplementedError();
	}

	/**
	 * @abstract
	 */
	get nodeType()
	{
		throw new NotImplementedError();
	}

	get nodeValue()
	{
		return null;
	}

	get ownerDocument()
	{
		if (!this.#ownerDocument && this.#parentNode)
		{
			this.#ownerDocument = this.#parentNode.ownerDocument;
		}
		return this.#ownerDocument;
	}

	get parentNode()
	{
		return this.#parentNode;
	}

	get previousSibling()
	{
		return this.#previousSibling;
	}

	get textContent()
	{
		return null;
	}

	set textContent(value)
	{
		for (const child of this.#childNodes)
		{
			this.#disconnect(child);
		}

		this.#childNodes = [];

		const document = this.ownerDocument;
		if (document)
		{
			this.appendChild(document.createTextNode(value));
		}
	}

	appendChild(newChild)
	{
		this.#assertSupportsChildren();

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
		this.#connect(newChild);
		return newChild;
	}

	// cloneNode(deep = false)
	// {
	// }

	// compareDocumentPosition(otherNode)
	// {
	// }

	contains(otherNode)
	{
		if (otherNode === this)
		{
			return true;
		}

		for (const child of this.#childNodes)
		{
			if (child.contains(otherNode))
			{
				return true;
			}
		}

		return false;
	}

	// getBoxQuads()
	// {
	// }

	getRootNode()
	{
		return this.ownerDocument;
	}

	hasChildNodes()
	{
		return this.#childNodes.length !== 0;
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
		this.#connect(newChild);
		return newChild;
	}

	isDefaultNamespace(namespaceURI)
	{
		// TODO
	}

	// isEqualNode(otherNode)
	// {
	// }

	isSameNode(otherNode)
	{
		return otherNode === this;
	}

	lookupPrefix(namespaceURI)
	{
		// TODO
	}

	lookupNamespaceURI(prefix)
	{
		// TODO
	}

	normalize()
	{
		let iFrom = null;
		let iTo = null;
		let length = this.#childNodes.length;
		let i = 0;

		for (; i < length; ++i)
		{
			// find consecutive text nodes
			if (this.#childNodes[i].nodeType === Node.TEXT_NODE)
			{
				if (iFrom === null)
				{
					iFrom = i;
				}
				iTo = i;
			}
			else if (iFrom !== null)
			{
				// merge text contents
				let text = '';
				let j = iFrom;
				for (; j !== jTo; ++j)
				{
					text += this.#childNodes[j].nodeValue;
				}

				// use the first for the concat string (unless it's empty)
				if (text)
				{
					this.#childNodes[iFrom++].nodeValue = text;
				}

				// delete all the other nodes
				if (iFrom !== iTo)
				{
					const deleted = this.#childNodes.splice(iFrom, iTo - iFrom);
					const previous = deleted[0].previousSibling;
					const next = deleted[deleted.length - 1].nextSibling;

					if (previous)
					{
						previous.#nextSibling = next;
					}

					if (next)
					{
						next.#previousSibling = previous;
					}

					for (const node in deleted)
					{
						this.#disconnect(node);
					}
				}

				iFrom = null;
				iTo = null;
			}
		}
	}

	removeChild(oldChild)
	{
		this.#assertSupportsChildren();

		const index = this.#childNodes.indexOf(oldChild);
		if (index === -1)
		{
			throw new Error('oldChild is not a child of this Node.');
		}

		this.#childNodes.splice(index, 1);
		if (index === 0)
		{
			if (this.#childNodes.length !== 0)
			{
				this.#childNodes[0].#previousSibling = null;
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

		this.#disconnect(oldChild);
		return oldChild;
	}

	replaceChild(newChild, oldChild)
	{
		this.#assertSupportsChildren();

		const index = this.#childNodes.indexOf(oldChild);
		if (index === -1)
		{
			throw new Error('oldChild is not a child of this Node.');
		}

		this.#childNodes[index] = newChild;
		if (index === 0)
		{
			if (this.#childNodes.length === 1)
			{
				newChild.#nextSibling = null;
				newChild.#previousSibling = null;
			}
			else
			{
				const next = this.#childNodes[1];
				newChild.#previousSibling = null;
				newChild.#nextSibling = next;
				next.#previousSibling = newChild;
			}
		}
		else
		{
			const previous = this.#childNodes[index - 1];
			if (index + 1 === this.#childNodes.length)
			{
				newChild.#previousSibling = previous;
				newChild.#nextSibling = null;
				previous.#nextSibling = newChild;
			}
			else
			{
				const next = this.#childNodes[index + 1];
				newChild.#previousSibling = previous;
				newChild.#nextSibling = next;
				previous.#nextSibling = newChild;
				next.#previousSibling = newChild;
			}
		}

		this.#connect(newChild);
		this.#disconnect(oldChild);
		return oldChild;
	}

	_onConnected()
	{
		if (!this.#isConnected)
		{
			this.#isConnected = true;
			this.connectedCallback && this.connectedCallback();
		}
	}

	_onDisconnected()
	{
		if (this.#isConnected)
		{
			this.#isConnected = false;
			this.disconnectedCallback && this.disconnectedCallback();
		}
	}

	// FUTURE: use private method syntax
	#assertSupportsChildren = () =>
	{
		if (this.constructor.supportsChildren !== true)
		{
			throw new Error('This Node does not support children.');
		}
	};

	// FUTURE: use private method syntax
	#connect = node =>
	{
		node.#ownerDocument = this.ownerDocument;
		node.#parentNode = this;
		node._onConnected();
	};

	// FUTURE: use private method syntax
	#disconnect = node =>
	{
		node.#ownerDocument = null;
		node.#parentNode = null;
		node.#nextSibling = null;
		node.#previousSibling = null;
		node._onDisconnected();
	};
}
