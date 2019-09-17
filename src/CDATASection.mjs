import Node from './Node.mjs';
import CharacterData from './CharacterData.mjs';

export default class CDATASection extends CharacterData
{
	get nodeName()
	{
		return '#cdata-section';
	}

	get nodeType()
	{
		return Node.CDATA_SECTION_NODE;
	}
}
