import Node from './Node.mjs';
import ChildNode from './mixins/ChildNode.mjs';
import DocumentOrElement from './mixins/DocumentOrElement.mjs';
import Attr from './Attr.mjs';
import ClassList from './ClassList.mjs';
import { stringify, isElement } from './utils.mjs';

function getName(obj)
{
	return obj.name;
}

export default class Element extends DocumentOrElement(ChildNode(Node))
{
	static supportsChildren = true;

	#attributes = [];
	#classList;
	#localName;
	#namespaceURI = null;
	#prefix = null;

	constructor(localName)
	{
		super();
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

	get nextElementSibling()
	{
		let sibling = this.nextSibling;
		while (sibling && !isElement(sibling))
		{
			sibling = sibling.nextSibling;
		}
		return sibling;
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

	get previousElementSibling()
	{
		let sibling = this.previousSibling;
		while (sibling && !isElement(sibling))
		{
			sibling = sibling.previousSibling;
		}
		return sibling;
	}

	get tagName()
	{
		return this.#prefix ? `${this.#prefix}:${this.#localName}` : this.#localName;
	}

	get textContent()
	{
		let content = '';
		for (const node of this.childNodes)
		{
			if (node.nodeType === Node.COMMENT_NODE || node.nodeType === Node.PROCESSING_INSTRUCTION_NODE)
			{
				continue;
			}
			content += node.textContent;
		}
		return content;
	}

	closest(selector)
	{
		// TODO
	}

	getAttribute(attrName)
	{
		const node = this.getAttributeNode(attrName);
		return node && node.value;
	}

	getAttributeNames()
	{
		return this.#attributes.map(getName);
	}

	getAttributeNS(namespace, attrName)
	{
		const node = this.getAttributeNodeNS(namespace, attrName);
		return node && node.value;
	}

	getAttributeNode(attrName)
	{
		return this.getAttributeNodeNS(null, attrName);
	}

	getAttributeNodeNS(namespace, attrName)
	{
		const index = this.#indexOfAttributeNS(namespace, attrName);
		return index === -1 ? null : this.#attributes[index];
	}

	hasAttribute(attrName)
	{
		return Boolean(this.getAttributeNode(attrName));
	}

	hasAttributeNS(namespace, attrName)
	{
		return Boolean(this.getAttributeNodeNS(namespace, attrName));
	}

	hasAttributes()
	{
		return this.#attributes.length !== 0;
	}

	removeAttribute(attrName)
	{
		const attr = this.getAttributeNode(attrName);
		return attr ? Boolean(this.removeAttributeNode(attr)) : false;
	}

	removeAttributeNS(namespace, attrName)
	{
		const attr = this.getAttributeNodeNS(namespace, attrName);
		return attr ? Boolean(this.removeAttributeNode(namespace, attrName)) : false;
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

	setAttribute(attrName, value)
	{
		const attr = new Attr(attrName);
		attr.value = value;
		this.setAttributeNode(attr);
	}

	setAttributeNS(namespace, attrName, value)
	{
		const attr = new Attr(attrName);
		attr.namespaceURI = namespace;
		attr.value = value;
		this.setAttributeNodeNS(attr);
	}

	setAttributeNode(attrNode)
	{
		return this.setAttributeNodeNS(attrNode);
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

	// callbacks
	_onConnected()
	{
		const id = this.id;
		if (id)
		{
			const document = this.ownerDocument;
			if (document)
			{
				document._idAddedCallback(this, id);
			}
		}
		super._onConnected();
	}

	_onDisconnected()
	{
		const id = this.id;
		if (id)
		{
			const document = this.ownerDocument;
			if (document)
			{
				document._idRemovedCallback(this, id);
			}
		}
		super._onDisconnected();
	}

	_onAttributeChanged(attrName, oldValue, newValue)
	{
		switch (attrName)
		{
			case 'id':
			{
				const document = this.ownerDocument;
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
	};
}
