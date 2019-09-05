import Node from './Node.mjs';
import CharacterData from './CharacterData.mjs';

export default class CDATASection extends CharacterData
{
	get nodeName()
	{
		return '#cdata'; // TODO: validate this is the standard
	}

	get nodeType()
	{
		return Node.CDATA_SECTION_NODE;
	}
}
