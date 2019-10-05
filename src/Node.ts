import Document from './Document';
import Element from './Element';
import NodeType from './NodeType';
import Text from './Text';
import { callback, isElement } from './utils';

abstract class Node
{
	public static ELEMENT_NODE = NodeType.ELEMENT_NODE;
	public static TEXT_NODE = NodeType.TEXT_NODE;
	public static CDATA_SECTION_NODE = NodeType.CDATA_SECTION_NODE;
	public static PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE;
	public static COMMENT_NODE = NodeType.COMMENT_NODE;
	public static DOCUMENT_NODE = NodeType.DOCUMENT_NODE;
	public static DOCUMENT_TYPE_NODE = NodeType.DOCUMENT_TYPE_NODE;

	public static setOwnerDocument(node: Node, ownerDocument: Document)
	{
		node._ownerDocument = ownerDocument;
	}

	protected supportsChildren: boolean = false;
	protected _childNodes: Node[] = [];
	protected _nextSibling: Node | null = null;
	protected _ownerDocument: Document;
	protected _parentNode: Node | null = null;
	protected _previousSibling: Node | null = null;

	private _isConnected: boolean = false;

	public constructor(ownerDocument: Document)
	{
		this._ownerDocument = ownerDocument;
	}

	public get childNodes()
	{
		return this._childNodes;
	}

	public get firstChild()
	{
		return this._childNodes.length === 0 ? null : this._childNodes[0];
	}

	public get isConnected()
	{
		return Boolean(this.ownerDocument);
	}

	public get lastChild()
	{
		const length = this._childNodes.length;
		return length === 0 ? null : this._childNodes[length - 1];
	}

	public get nextSibling()
	{
		return this._nextSibling;
	}

	public abstract get nodeName(): string;

	public abstract get nodeType(): number;

	public get nodeValue(): string | null
	{
		return null;
	}

	public get ownerDocument()
	{
		return this._ownerDocument!;
	}

	public get parentElement(): Element | null
	{
		return this._parentNode && isElement(this._parentNode) ? this._parentNode as Element : null;
	}

	public get parentNode()
	{
		return this._parentNode;
	}

	public get previousSibling()
	{
		return this._previousSibling;
	}

	public get textContent()
	{
		return this.getTextContent();
	}

	public set textContent(value)
	{
		for (const child of this._childNodes)
		{
			this.disconnect(child);
		}

		this._childNodes = [];
		if (value)
		{
			this.appendChild(this._ownerDocument.createTextNode(value));
		}
	}

	public after(...nodes: Array<Node | string>)
	{
		if (this._parentNode)
		{
			for (const node of nodes)
			{
				this._parentNode.insertBefore(this.asNode(node), this._nextSibling);
			}
		}
	}

	public appendChild(newChild: Node)
	{
		this.assertSupportsChildren();
		this.assertValidChild(newChild);

		newChild._nextSibling = null;

		const length = this._childNodes.length;
		if (length !== 0)
		{
			const previous = this._childNodes[length - 1];
			newChild._previousSibling = previous;
			previous._nextSibling = newChild;
		}
		else
		{
			newChild._previousSibling = null;
		}

		this._childNodes.push(newChild);
		this.connect(newChild);
		return newChild;
	}

	public before(...nodes: Array<Node | string>)
	{
		if (this._parentNode)
		{
			for (const node of nodes)
			{
				this._parentNode.insertBefore(this.asNode(node), this);
			}
		}
	}

	// public cloneNode(deep = false)
	// {
	// 	// TODO
	// }

	// public compareDocumentPosition(otherNode)
	// {
	// 	// TODO
	// }

	public contains(otherNode: Node)
	{
		if (otherNode === this)
		{
			return true;
		}

		for (const child of this._childNodes)
		{
			if (child.contains(otherNode))
			{
				return true;
			}
		}

		return false;
	}

	public getRootNode()
	{
		return this._ownerDocument;
	}

	public hasChildNodes()
	{
		return this._childNodes.length !== 0;
	}

	public insertBefore(newChild: Node, refChild?: Node | null)
	{
		this.assertSupportsChildren();
		this.assertValidChild(newChild);

		if (!refChild)
		{
			return this.appendChild(newChild);
		}

		const index = this._childNodes.indexOf(refChild);
		if (index === -1)
		{
			throw new Error('refChild tis not a child of this Node.');
		}

		if (index !== 0)
		{
			const previous = this._childNodes[index - 1];
			newChild._previousSibling = previous;
			previous._nextSibling = newChild;
		}
		else
		{
			newChild._previousSibling = null;
		}

		newChild._nextSibling = refChild;
		refChild._previousSibling = newChild;
		this._childNodes.splice(index, 0, newChild);
		this.connect(newChild);
		return newChild;
	}

	public isDefaultNamespace(namespaceURI: string | null)
	{
		const parent = this.parentElement;
		return Boolean(parent && parent.isDefaultNamespace(namespaceURI));
	}

	// public isEqualNode(otherNode)
	// {
	// 	// TODO
	// }

	public isSameNode(otherNode: Node)
	{
		return otherNode === this;
	}

	public lookupNamespaceURI(prefix: string | null)
	{
		const parent = this.parentElement;
		return parent && parent.lookupNamespaceURI(prefix);
	}

	public lookupPrefix(namespaceURI: string | null)
	{
		const parent = this.parentElement;
		return parent && parent.lookupPrefix(namespaceURI);
	}

	public normalize()
	{
		let iFrom = null;
		let iTo = null;
		let length = this._childNodes.length;
		let i = 0;

		while (i !== length)
		{
			// find consecutive text nodes
			if (this._childNodes[i].nodeType === NodeType.TEXT_NODE)
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
				while (j !== iTo)
				{
					text += this._childNodes[j++].nodeValue;
				}

				// use the first for the concat string (unless it's empty)
				if (text)
				{
					(this._childNodes[iFrom++] as Text).nodeValue = text;
				}

				// delete all the other nodes
				if (iFrom !== iTo)
				{
					const deleted = this._childNodes.splice(iFrom, iTo - iFrom);
					const previous = deleted[0].previousSibling;
					const next = deleted[deleted.length - 1].nextSibling;

					if (previous)
					{
						previous._nextSibling = next;
					}

					if (next)
					{
						next._previousSibling = previous;
					}

					for (const node of deleted)
					{
						this.disconnect(node);
					}

					length -= deleted.length;
				}

				iFrom = null;
				iTo = null;
			}
			++i;
		}
	}

	public remove()
	{
		if (this._parentNode)
		{
			this._parentNode.removeChild(this);
		}
	}

	public removeChild(oldChild: Node)
	{
		this.assertSupportsChildren();

		const index = this._childNodes.indexOf(oldChild);
		if (index === -1)
		{
			throw new Error('oldChild is not a child of this Node.');
		}

		this._childNodes.splice(index, 1);
		if (index === 0)
		{
			if (this._childNodes.length !== 0)
			{
				this._childNodes[0]._previousSibling = null;
			}
		}
		else
		{
			const previous = this._childNodes[index - 1];
			if (index === this._childNodes.length)
			{
				previous._nextSibling = null;
			}
			else
			{
				const next = this._childNodes[index];
				previous._nextSibling = next;
				next._previousSibling = previous;
			}
		}

		this.disconnect(oldChild);
		return oldChild;
	}

	public replaceChild(newChild: Node, oldChild: Node)
	{
		this.assertSupportsChildren();
		this.assertValidChild(newChild);

		const index = this._childNodes.indexOf(oldChild);
		if (index === -1)
		{
			throw new Error('oldChild is not a child of this Node.');
		}

		this._childNodes[index] = newChild;
		if (index === 0)
		{
			if (this._childNodes.length === 1)
			{
				newChild._nextSibling = null;
				newChild._previousSibling = null;
			}
			else
			{
				const next = this._childNodes[1];
				newChild._previousSibling = null;
				newChild._nextSibling = next;
				next._previousSibling = newChild;
			}
		}
		else
		{
			const previous = this._childNodes[index - 1];
			if (index + 1 === this._childNodes.length)
			{
				newChild._previousSibling = previous;
				newChild._nextSibling = null;
				previous._nextSibling = newChild;
			}
			else
			{
				const next = this._childNodes[index + 1];
				newChild._previousSibling = previous;
				newChild._nextSibling = next;
				previous._nextSibling = newChild;
				next._previousSibling = newChild;
			}
		}

		this.connect(newChild);
		this.disconnect(oldChild);
		return oldChild;
	}

	public replaceWith(...nodes: Array<Node | string>)
	{
		if (this._parentNode && nodes.length !== 0)
		{
			let i = nodes.length - 1;
			let prev = this.asNode(nodes[i]);

			this._parentNode.replaceChild(prev, this);
			while (i !== 0)
			{
				const node = this.asNode(nodes[i--]);
				this._parentNode.insertBefore(node, prev);
				prev = node;
			}
		}
	}

	protected getTextContent(): string | null
	{
		return null;
	}

	protected onConnected()
	{
		if (!this._isConnected)
		{
			this._isConnected = true;
			callback(this, 'connectedCallback');
		}
	}

	protected onDisconnected()
	{
		if (this._isConnected)
		{
			this._isConnected = false;
			callback(this, 'disconnectedCallback');
		}
	}

	private asNode(obj: Node | string): Node
	{
		return typeof obj === 'string' ? this._ownerDocument.createTextNode(obj) : obj;
	}

	private assertSupportsChildren()
	{
		if (this.supportsChildren !== true)
		{
			throw new Error('This Node does not support children.');
		}
	}

	private assertValidChild(child: Node)
	{
		if (child._ownerDocument !== this._ownerDocument)
		{
			throw new Error('Node belongs to a different Document');
		}
	}

	private connect(node: Node)
	{
		node._parentNode = this;
		node.onConnected();
	}

	private disconnect(node: Node)
	{
		node._parentNode = null;
		node._nextSibling = null;
		node._previousSibling = null;
		node.onDisconnected();
	}
}

export default Node;
