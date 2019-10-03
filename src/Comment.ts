import CharacterData from './CharacterData';
import NodeType from './NodeType';

class Comment extends CharacterData
{
	get nodeName()
	{
		return '#comment';
	}

	get nodeType()
	{
		return NodeType.COMMENT_NODE;
	}
}

export default Comment;
