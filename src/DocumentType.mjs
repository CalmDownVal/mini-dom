import Node from './Node.mjs';

export default class DocumentType extends Node
{
	#qualifiedNameStr;
	#publicId;
	#systemId;

	constructor(qualifiedNameStr, publicId, systemId)
	{
		super();
		this.#qualifiedNameStr = qualifiedNameStr;
		this.#publicId = publicId;
		this.#systemId = systemId;
	}

	get qualifiedNameStr()
	{
		return this.#qualifiedNameStr;
	}

	get publicId()
	{
		return this.#publicId;
	}

	get systemId()
	{
		return this.#systemId;
	}

	get nodeName()
	{
		return this.#qualifiedNameStr;
	}

	get nodeType()
	{
		return Node.DOCUMENT_TYPE_NODE;
	}
}
