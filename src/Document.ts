import Attr from './Attr';
import CDATASection from './CDATASection';
import Comment from './Comment';
import DocumentOrElement from './DocumentOrElement';
import DOMImplementation from './DOMImplementation';
import Element from './Element';
import Node from './Node';
import ProcessingInstruction from './ProcessingInstruction';
import Text from './Text';

function findId(root: Node, id: string): Element | null
{
	if (id && root.nodeType === Node.ELEMENT_NODE)
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
	public static readonly implementation = new DOMImplementation();

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

	protected supportsChildren = true;

	private idMap: Map<string, Element> = new Map();

	public get documentElement()
	{
		return this.firstElementChild;
	}

	public get ownerDocument()
	{
		return this;
	}

	public get nodeName()
	{
		return '#document';
	}

	public get nodeType()
	{
		return Node.DOCUMENT_NODE;
	}

	public createAttribute(qualifiedName: string)
	{
		return new Attr(qualifiedName);
	}

	public createAttributeNS(namespaceURI: string | null, qualifiedName: string)
	{
		const attr = new Attr(qualifiedName);
		attr.namespaceURI = namespaceURI;
		return attr;
	}

	public createCDATASection(data: string)
	{
		return new CDATASection(data);
	}

	public createComment(data: string)
	{
		return new Comment(data);
	}

	public createElement(qualifiedName: string)
	{
		return new Element(qualifiedName);
	}

	public createElementNS(namespaceURI: string | null, qualifiedName: string)
	{
		const node = new Element(qualifiedName);
		node.namespaceURI = namespaceURI;
		return node;
	}

	public createProcessingInstruction(target: string, data: string)
	{
		return new ProcessingInstruction(target, data);
	}

	public createTextNode(data: string)
	{
		return new Text(data);
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
}

export default Document;
