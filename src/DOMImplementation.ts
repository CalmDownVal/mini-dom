import Document from './Document';
import DocumentType from './DocumentType';

class DOMImplementation
{
	public createDocument()
	{
		return new Document();
	}

	public createDocumentType(qualifiedNameStr: string, publicId: string, systemId: string)
	{
		return new DocumentType(qualifiedNameStr, publicId, systemId);
	}

	public createHTMLDocument()
	{
		return new Document();
	}

	public hasFeature(/* feature, version */)
	{
		return false;
	}
}

export default DOMImplementation;
