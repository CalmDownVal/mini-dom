import Node from './Node.mjs';
import CharacterData from './CharacterData.mjs';

export default class DocumentType extends CharacterData
{
	get nodeName()
	{
		return '#document-type'; // TODO: validate this is the standard
	}

	get nodeType()
	{
		return Node.DOCUMENT_TYPE_NODE;
	}
}
