import Node from './Node';
import NodeType from './NodeType';

class DocumentType extends Node
{
	private _qualifiedNameStr: string;
	private _publicId: string;
	private _systemId: string;

	constructor(qualifiedNameStr: string, publicId: string, systemId: string)
	{
		super();
		this._qualifiedNameStr = qualifiedNameStr;
		this._publicId = publicId;
		this._systemId = systemId;
	}

	get qualifiedNameStr()
	{
		return this._qualifiedNameStr;
	}

	get publicId()
	{
		return this._publicId;
	}

	get systemId()
	{
		return this._systemId;
	}

	get nodeName()
	{
		return this._qualifiedNameStr;
	}

	get nodeType()
	{
		return NodeType.DOCUMENT_TYPE_NODE;
	}
}

export default DocumentType;
