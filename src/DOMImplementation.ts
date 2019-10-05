import Document from './Document';
import DocumentType from './DocumentType';
import Node from './Node';

export function createDocument(
	namespaceURI: string | null,
	qualifiedNameStr: string,
	documentType: DocumentType | null = null)
{
	const document = new Document();

	if (documentType)
	{
		Node.setOwnerDocument(documentType, document);
		document.appendChild(documentType);
	}

	const root = document.createElementNS(namespaceURI, qualifiedNameStr);
	document.appendChild(root);

	return document;
}

export function createDocumentType(qualifiedNameStr: string, publicId: string, systemId: string)
{
	return new DocumentType(null!, qualifiedNameStr, publicId, systemId);
}

export function createHTMLDocument(title: string | null = null)
{
	const dtd = new DocumentType(null!, 'html', '', '');
	const doc = createDocument(null, 'html', dtd);

	const head = doc.createElement('head');
	doc.documentElement.appendChild(head);

	const body = doc.createElement('body');
	doc.documentElement.appendChild(body);

	if (title)
	{
		const titleEl = doc.createElement('title');
		titleEl.textContent = title;
		head.appendChild(titleEl);
	}

	return doc;
}

class DOMImplementation
{
	private ownerDocument: Document;

	public constructor(ownerDocument: Document)
	{
		this.ownerDocument = ownerDocument;
	}

	public createDocument(namespaceURI: string | null, qualifiedNameStr: string, documentType: DocumentType | null = null)
	{
		return createDocument(namespaceURI, qualifiedNameStr, documentType);
	}

	public createDocumentType(qualifiedNameStr: string, publicId: string, systemId: string)
	{
		return new DocumentType(this.ownerDocument, qualifiedNameStr, publicId, systemId);
	}

	public createHTMLDocument(title: string | null = null)
	{
		return createHTMLDocument(title);
	}

	public hasFeature(/* feature, version */)
	{
		return false;
	}
}

export default DOMImplementation;
