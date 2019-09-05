import Node from './Node.mjs';
import CharacterData from './CharacterData.mjs';

export default class Comment extends CharacterData
{
	get nodeName()
	{
		return '#comment';
	}

	get nodeType()
	{
		return Node.COMMENT_NODE;
	}
}
