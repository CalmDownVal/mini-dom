import CharacterData from './CharacterData';
import Node from './Node';

class Text extends CharacterData
{
	get nodeName()
	{
		return '#text';
	}

	get nodeType()
	{
		return Node.TEXT_NODE;
	}
}

export default Text;
