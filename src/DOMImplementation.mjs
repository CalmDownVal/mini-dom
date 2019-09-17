import Document from './Document.mjs';
import DocumentType from './DocumentType.mjs';

export default class DOMImplementation
{
	createDocument()
	{
		return new Document();
	}

	createDocumentType(qualifiedNameStr, publicId, systemId)
	{
		return new DocumentType(qualifiedNameStr, publicId, systemId);
	}

	createHTMLDocument()
	{
		return new Document();
	}

	hasFeature(/* feature, version */)
	{
		return false;
	}
}
