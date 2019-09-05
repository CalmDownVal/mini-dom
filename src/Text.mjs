import Node from './Node.mjs';
import CharacterData from './CharacterData.mjs';

export default class Text extends CharacterData
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
