import Node from './Node.mjs';
import Attr from './Attr.mjs';
import ClassList from './ClassList.mjs';
import { stringify } from './utils.mjs';

function getName(attr)
{
	return attr.name;
}

export default class Element extends Node
{
	static supportsChildren = true;

	#attributes = [];
	#classList;
	#localName;
	#namespaceURI = null;
	#prefix = null;

	constructor(localName)
	{
		super(true);
		this.localName = localName;
	}

	get attributes()
	{
		return this.#attributes;
	}

	get classList()
	{
		if (!this.#classList)
		{
			this.#classList = new ClassList();
		}
		return this.#classList;
	}

	get className()
	{
		return this.getAttribute('class');
	}

	set className(value)
	{
		this.setAttribute('class', value);
	}

	get id()
	{
		return this.getAttribute('id');
	}

	set id(value)
	{
		this.setAttribute('id', value);
	}

	get localName()
	{
		return this.#localName;
	}

	set localName(value)
	{
		this.#localName = stringify(value, false, false);
	}

	get namespaceURI()
	{
		return this.#namespaceURI;
	}

	set namespaceURI(value)
	{
		this.#namespaceURI = stringify(value, true, true);
	}

	get nodeName()
	{
		return this.tagName;
	}

	get nodeType()
	{
		return Node.ELEMENT_NODE;
	}

	get prefix()
	{
		return this.#prefix;
	}

	set prefix(value)
	{
		this.#prefix = stringify(value, false, true);
	}

	get tagName()
	{
		return this.#prefix ? `${this.#prefix}:${this.#localName}` : this.#localName;
	}

	// attributes
	getAttribute(attrName)
	{
		const node = this.getAttributeNode(attrName);
		return node && node.value;
	}

	getAttributeNames()
	{
		return this.#attributes.map(getName);
	}

	hasAttribute(attrName)
	{
		return !!this.getAttributeNode(attrName);
	}

	removeAttribute(attrName)
	{
		const attr = this.getAttributeNode(attrName);
		return attr ? !!this.removeAttributeNode(attr) : false;
	}

	setAttribute(attrName, value)
	{
		const attr = new Attr(attrName);
		attr.value = value;
		this.setAttributeNode(attr);
	}

	// attributes with namespace
	getAttributeNS(namespace, attrName)
	{
		const node = this.getAttributeNodeNS(namespace, attrName);
		return node && node.value;
	}

	hasAttributeNS(namespace, attrName)
	{
		return !!this.getAttributeNodeNS(namespace, attrName);
	}

	removeAttributeNS(namespace, attrName)
	{
		const attr = this.getAttributeNodeNS(namespace, attrName);
		return attr ? !!this.removeAttributeNode(namespace, attrName) : false;
	}

	setAttributeNS(namespace, attrName, value)
	{
		const attr = new Attr(attrName);
		attr.namespaceURI = namespace;
		attr.value = value;
		this.setAttributeNodeNS(attr);
	}

	// attribute nodes
	getAttributeNode(attrName)
	{
		return this.getAttributeNodeNS(null, attrName);
	}

	removeAttributeNode(attrNode)
	{
		const index = this.#attributes.indexOf(attrNode);
		if (index === -1)
		{
			return null;
		}

		Attr._setOwnerElement(attrNode, null);
		this.#attributes.splice(index, 1);
		this._onAttributeChanged(attrNode.name, attrNode.value, null);
		return attrNode;
	}

	setAttributeNode(attrNode)
	{
		return this.setAttributeNodeNS(attrNode);
	}

	// attribute nodes with namespace
	getAttributeNodeNS(namespace, attrName)
	{
		const index = this.#indexOfAttributeNS(namespace, attrName);
		return index === -1 ? null : this.#attributes[index];
	}

	setAttributeNodeNS(attrNode)
	{
		let oldValue = null;
		let replacedAttr = null;
		const index = this.#indexOfAttributeNS(attrNode.namespaceURI, attrNode.localName);
		if (index === -1)
		{
			Attr._setOwnerElement(attrNode, this);
			this.#attributes.push(attrNode);
		}
		else
		{
			replacedAttr = this.#attributes[index];
			Attr._setOwnerElement(replacedAttr, null);
			Attr._setOwnerElement(attrNode, this);
			this.#attributes[index] = attrNode;
		}
		this._onAttributeChanged(attrNode.name, oldValue, attrNode.value);
		return replacedAttr;
	}

	// querying
	getElementsByClassName(className)
	{
		return this.#filterDescendants(node => node.classList.contains(className));
	}

	getElementsByTagName(tagName)
	{
		return this.#filterDescendants(node => node.tagName === tagName);
	}

	querySelector(selector)
	{
		// TODO
	}

	querySelectorAll(selector)
	{
		// TODO
	}

	// callbacks
	_onConnected()
	{
		const id = this.id;
		if (id)
		{
			document._onIdAdded(this, id);
		}
		super._onConnected();
	}

	_onDisconnected()
	{
		const id = this.id;
		if (id)
		{
			document._onIdRemoved(this, id);
		}
		super._onDisconnected();
	}

	_onAttributeChanged(attrName, oldValue, newValue)
	{
		switch (attrName)
		{
			case 'id':
			{
				const document = this.document;
				if (document)
				{
					document._idRemovedCallback(this, oldValue);
					document._idAddedCallback(this, newValue);
				}
				break;
			}

			case 'class':
				this.classList._parse(newValue);
				break;
		}

		if (this.attributeChangedCallback)
		{
			const observed = this.constructor.observedAttributes;
			if (observed && observed.includes(attrName))
			{
				this.attributeChangedCallback(attrName, oldValue, newValue);
			}
		}
	}

	// FUTURE: use private method syntax
	#indexOfAttributeNS = (namespace, attrName) =>
	{
		const attrs = this.#attributes;
		const length = attrs.length;
		for (let i = 0; i < length; ++i)
		{
			const attr = attrs[i];
			if (attr.localName === attrName && attr.namespaceURI === namespace)
			{
				return i;
			}
		}
		return -1;
	}

	// FUTURE: use private method syntax
	#filterDescendants = (filter, list = []) =>
	{
		for (const child of this.children)
		{
			if (filter(child))
			{
				list.push(child);
			}
			child.#filterDescendants(filter, list);
		}
		return list;
	}
}
