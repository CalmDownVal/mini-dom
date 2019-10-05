import Attr from './Attr';
import CDATASection from './CDATASection';
import Comment from './Comment';
import DocumentOrElement from './DocumentOrElement';
import DocumentType from './DocumentType';
import DOMImplementation from './DOMImplementation';
import Element from './Element';
import Node from './Node';
import NodeType from './NodeType';
import ProcessingInstruction from './ProcessingInstruction';
import Text from './Text';

function findId(root: Node, id: string): Element | null
{
	if (id && root.nodeType === NodeType.ELEMENT_NODE)
	{
		if ((root as Element).id === id)
		{
			return root as Element;
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

class Document extends DocumentOrElement
{
	public static registerId(doc: Document, elem: Element, newId: string | null)
	{
		if (newId)
		{
			doc.idMap.set(newId, elem);
		}
	}

	public static unregisterId(doc: Document, oldId: string | null)
	{
		if (oldId && doc.idMap.delete(oldId))
		{
			const found = findId(doc, oldId);
			if (found)
			{
				Document.registerId(doc, found, oldId);
			}
		}
	}

	private readonly idMap: Map<string, Element> = new Map();
	private readonly _implementation = new DOMImplementation(this);

	public constructor()
	{
		super(null!); // silence, brand
		this._ownerDocument = this;
	}

	public get body()
	{
		const body = this.documentElement.lastElementChild;
		return body && body.tagName === 'body' ? body : null;
	}

	public get doctype()
	{
		for (const child of this._childNodes)
		{
			if (child.nodeType === NodeType.DOCUMENT_TYPE_NODE)
			{
				return child as DocumentType;
			}
		}
		return null;
	}

	public get documentElement()
	{
		return this.firstElementChild as Element;
	}

	public get head()
	{
		const head = this.documentElement.firstElementChild;
		return head && head.tagName === 'head' ? head : null;
	}

	public get implementation()
	{
		return this._implementation;
	}

	public get nodeName()
	{
		return '#document';
	}

	public get nodeType()
	{
		return NodeType.DOCUMENT_NODE;
	}

	public adoptNode(externalNode: Node)
	{
		Node.setOwnerDocument(externalNode, this);
		return externalNode;
	}

	public createAttribute(qualifiedName: string)
	{
		return Attr.create(qualifiedName);
	}

	public createAttributeNS(namespaceURI: string | null, qualifiedName: string)
	{
		return Attr.createNS(namespaceURI, qualifiedName);
	}

	public createCDATASection(data: string)
	{
		return new CDATASection(this, data);
	}

	public createComment(data: string)
	{
		return new Comment(this, data);
	}

	public createElement(qualifiedName: string)
	{
		return Element.create(this, qualifiedName);
	}

	public createElementNS(namespaceURI: string | null, qualifiedName: string)
	{
		return Element.createNS(this, namespaceURI, qualifiedName);
	}

	public createProcessingInstruction(target: string, data: string)
	{
		return new ProcessingInstruction(this, target, data);
	}

	public createTextNode(data: string)
	{
		return new Text(this, data);
	}

	public getElementById(id: string)
	{
		return this.idMap.get(id) || null;
	}

	public isDefaultNamespace(namespaceURI: string | null)
	{
		const elem = this.firstElementChild;
		return elem ? elem.isDefaultNamespace(namespaceURI) : false;
	}

	public lookupNamespaceURI(prefix: string | null)
	{
		const elem = this.firstElementChild;
		return elem && elem.lookupNamespaceURI(prefix);
	}

	public lookupPrefix(namespaceURI: string | null)
	{
		const elem = this.firstElementChild;
		return elem && elem.lookupPrefix(namespaceURI);
	}
}

export default Document;
