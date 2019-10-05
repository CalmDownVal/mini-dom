import CharacterData from './CharacterData';
import NodeType from './NodeType';

class Text extends CharacterData
{
	get nodeName()
	{
		return '#text';
	}

	get nodeType()
	{
		return NodeType.TEXT_NODE;
	}
}

export default Text;
