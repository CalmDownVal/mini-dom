import Attr from './Attr.mjs';
import CDATASection from './CDATASection.mjs';
import Comment from './Comment.mjs';
import DOMImplementation from './DOMImplementation.mjs';
import Element from './Element.mjs';
import Node from './Node.mjs';
import DocumentOrElement from './mixins/DocumentOrElement.mjs';
import ProcessingInstruction from './ProcessingInstruction.mjs';
import Text from './Text.mjs';

function findId(root, id)
{
	if (id && root.nodeType === Node.ELEMENT_NODE)
	{
		if (root.id === id)
		{
			return root;
		}

		for (const child of root.childNodes)
		{
			const found = findId(child, id);
			if (found)
			{
				return found;
			}
		}
	}
	return null;
}

export default class Document extends DocumentOrElement(Node)
{
	static supportsChildren = true;
	static implementation = new DOMImplementation();

	#ids = new Map();

	constructor()
	{
		super();
	}

	get ownerDocument()
	{
		return this;
	}

	get nodeName()
	{
		return '#document';
	}

	get nodeType()
	{
		return Node.DOCUMENT_NODE;
	}

	createAttribute(qualifiedName)
	{
		return new Attr(qualifiedName);
	}

	createAttributeNS(namespaceURI, qualifiedName)
	{
		const attr = new Attr(qualifiedName);
		attr.namespaceURI = namespaceURI;
		return attr;
	}

	createCDATASection(data)
	{
		const node = new CDATASection();
		node.data = data;
		return node;
	}

	createComment(data)
	{
		const node = new Comment();
		node.data = data;
		return node;
	}

	createElement(qualifiedName)
	{
		return new Element(qualifiedName);
	}

	createElementNS(namespaceURI, qualifiedName)
	{
		const node = new Element(qualifiedName);
		node.namespaceURI = namespaceURI;
		return node;
	}

	createProcessingInstruction(target, data)
	{
		const node = new ProcessingInstruction(target);
		node.data = data;
		return node;
	}

	createTextNode(data)
	{
		const node = new Text();
		node.data = data;
		return node;
	}

	getElementById(id)
	{
		return this.#ids.get(id) || null;
	}

	_idAddedCallback(node, newId)
	{
		if (newId)
		{
			this.#ids.set(newId, node);
		}
	}

	_idRemovedCallback(node, oldId)
	{
		if (oldId && this.#ids.delete(oldId))
		{
			const found = findId(this, oldId);
			if (found)
			{
				this._idAddedCallback(found, oldId);
			}
		}
	}
}
