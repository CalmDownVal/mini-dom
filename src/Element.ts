import Attr from './Attr';
import ClassList from './ClassList';
import Document from './Document';
import INamespaceMember from './interfaces/INamespaceMember';
import Node from './Node';
import NodeType from './NodeType';
import { isElement, stringify, stringifyNull } from './utils';

function getName(attr: Attr)
{
	return attr.name;
}

class Element extends Node implements INamespaceMember
{
	public static notifyAttributeChanged(source: Attr, oldValue: string | null, newValue: string | null)
	{
		const element = source.ownerElement;
		if (element)
		{
			element.onAttributeChanged(source.localName, oldValue, newValue);
		}
	}

	protected supportsChildren = true;

	private _attributes: Attr[] = [];
	private _classList?: ClassList;
	private _localName: string = '';
	private _namespaceURI: string | null = null;
	private _prefix: string | null = null;

	public constructor(localName: string)
	{
		super();
		this._localName = localName;
	}

	public get attributes()
	{
		return this._attributes;
	}

	public get classList()
	{
		if (!this._classList)
		{
			this._classList = new ClassList(this);
		}
		return this._classList;
	}

	public get className()
	{
		return this.getAttribute('class');
	}

	public set className(value)
	{
		this.setAttribute('class', value);
	}

	public get id()
	{
		return this.getAttribute('id');
	}

	public set id(value: string | null)
	{
		this.setAttribute('id', value);
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

	public get nextElementSibling()
	{
		let sibling = this.nextSibling;
		while (sibling && !isElement(sibling))
		{
			sibling = sibling.nextSibling;
		}
		return sibling;
	}

	public get nodeName()
	{
		return this.tagName;
	}

	public get nodeType()
	{
		return NodeType.ELEMENT_NODE;
	}

	public get prefix()
	{
		return this._prefix;
	}

	public set prefix(value)
	{
		this._prefix = stringifyNull(value);
	}

	public get previousElementSibling()
	{
		let sibling = this.previousSibling;
		while (sibling && !isElement(sibling))
		{
			sibling = sibling.previousSibling;
		}
		return sibling;
	}

	public get tagName()
	{
		return this._prefix && this._namespaceURI ? `${this._prefix}:${this._localName}` : this._localName;
	}

	public get textContent()
	{
		let content = '';
		for (const node of this.childNodes)
		{
			if (node.nodeType === NodeType.COMMENT_NODE || node.nodeType === NodeType.PROCESSING_INSTRUCTION_NODE)
			{
				continue;
			}
			content += node.textContent;
		}
		return content;
	}

	// public closest(selector: string)
	// {
	// 	// TODO
	// }

	public getAttribute(attrName: string)
	{
		return this.getAttributeNS(null, attrName);
	}

	public getAttributeNames()
	{
		return this._attributes.map(getName);
	}

	public getAttributeNS(namespaceURI: string | null, attrName: string)
	{
		const attr = this.getAttributeNodeNS(namespaceURI, attrName);
		return attr && attr.value;
	}

	public getAttributeNode(attrName: string)
	{
		return this.getAttributeNodeNS(null, attrName);
	}

	public getAttributeNodeNS(namespaceURI: string | null, attrName: string)
	{
		const index = this.indexOfAttributeNS(namespaceURI, attrName);
		return index === -1 ? null : this._attributes[index];
	}

	public hasAttribute(attrName: string)
	{
		return this.hasAttributeNS(null, attrName);
	}

	public hasAttributeNS(namespaceURI: string | null, attrName: string)
	{
		return Boolean(this.getAttributeNodeNS(namespaceURI, attrName));
	}

	public hasAttributes()
	{
		return this._attributes.length !== 0;
	}

	public isDefaultNamespace(namespaceURI: string | null): boolean
	{
		if (!this._prefix)
		{
			return this._namespaceURI === namespaceURI;
		}

		const attr = this.getAttributeNode('xmlns');
		if (attr)
		{
			return attr.value === namespaceURI;
		}

		return super.isDefaultNamespace(namespaceURI);
	}

	public lookupNamespaceURI(prefix: string | null): string | null
	{
		if (this._namespaceURI && this._prefix === prefix)
		{
			return this._namespaceURI;
		}

		for (const attr of this._attributes)
		{
			if ((attr.prefix === 'xmlns' && attr.localName === prefix) || (!prefix && attr.localName === 'xmlns'))
			{
				return attr.value;
			}
		}

		return super.lookupNamespaceURI(prefix);
	}

	public lookupPrefix(namespaceURI: string | null): string | null
	{
		if (this._namespaceURI === namespaceURI)
		{
			return this._prefix;
		}

		for (const attr of this._attributes)
		{
			if (attr.prefix === 'xmlns' && attr.value === namespaceURI)
			{
				return attr.localName;
			}
		}

		return super.lookupPrefix(namespaceURI);
	}

	public removeAttribute(attrName: string)
	{
		return this.removeAttributeNS(null, attrName);
	}

	public removeAttributeNS(namespaceURI: string | null, attrName: string)
	{
		const attr = this.getAttributeNodeNS(namespaceURI, attrName);
		return attr ? Boolean(this.removeAttributeNode(attr)) : false;
	}

	public removeAttributeNode(attrNode: Attr)
	{
		const index = this._attributes.indexOf(attrNode);
		if (index === -1)
		{
			return null;
		}

		Attr.setOwnerElement(attrNode, null);
		this._attributes.splice(index, 1);
		this.onAttributeChanged(attrNode.name, attrNode.value, null);
		return attrNode;
	}

	public setAttribute(attrName: string, value: string | null)
	{
		this.setAttributeNS(null, attrName, value);
	}

	public setAttributeNS(namespaceURI: string | null, attrName: string, value: string | null)
	{
		if (value === null)
		{
			this.removeAttributeNS(namespaceURI, attrName);
			return;
		}

		const attr = new Attr(attrName, value);
		attr.namespaceURI = namespaceURI;
		this.setAttributeNodeNS(attr);
	}

	public setAttributeNode(attrNode: Attr)
	{
		return this.setAttributeNodeNS(attrNode);
	}

	public setAttributeNodeNS(attrNode: Attr)
	{
		let replacedAttr = null;

		const index = this.indexOfAttributeNS(attrNode.namespaceURI, attrNode.localName);
		if (index === -1)
		{
			Attr.setOwnerElement(attrNode, this);
			this._attributes.push(attrNode);
		}
		else
		{
			replacedAttr = this._attributes[index];
			Attr.setOwnerElement(replacedAttr, null);
			Attr.setOwnerElement(attrNode, this);
			this._attributes[index] = attrNode;
		}

		this.onAttributeChanged(attrNode.name, replacedAttr && replacedAttr.value, attrNode.value);
		return replacedAttr;
	}

	// callbacks
	protected onConnected()
	{
		const id = this.id;
		if (id)
		{
			const document = this.ownerDocument;
			if (document)
			{
				Document.registerId(document, this, id);
			}
		}
		super.onConnected();
	}

	protected onDisconnected()
	{
		const id = this.id;
		if (id)
		{
			const document = this.ownerDocument;
			if (document)
			{
				Document.unregisterId(document, id);
			}
		}
		super.onDisconnected();
	}

	protected onAttributeChanged(attrName: string, oldValue: string | null, newValue: string | null)
	{
		switch (attrName)
		{
			case 'id':
			{
				const document = this.ownerDocument;
				if (document)
				{
					Document.unregisterId(document, oldValue);
					Document.registerId(document, this, newValue);
				}
				break;
			}

			case 'class':
				this.classList.parse(newValue);
				break;
		}

		const fn = (this as any).attributeChangedCallback;
		if (typeof fn === 'function')
		{
			const observed = (this as any).prototype.constructor.observedAttributes;
			if (observed && observed.includes(attrName))
			{
				fn.call(this, attrName, oldValue, newValue);
			}
		}
	}

	private indexOfAttributeNS(namespaceURI: string | null, attrName: string)
	{
		const attrs = this._attributes;
		const length = attrs.length;

		let i = 0;
		while (i !== length)
		{
			const attr = attrs[i];
			if (attr.localName === attrName && attr.namespaceURI === namespaceURI)
			{
				return i;
			}
			++i;
		}
		return -1;
	}
}

export default Element;
