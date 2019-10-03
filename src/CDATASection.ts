import CharacterData from './CharacterData';
import NodeType from './NodeType';

class CDATASection extends CharacterData
{
	get nodeName()
	{
		return '#cdata-section';
	}

	get nodeType()
	{
		return NodeType.CDATA_SECTION_NODE;
	}
}

export default CDATASection;
