import CharacterData from './CharacterData';
import Document from './Document';
import NodeType from './NodeType';
import { stringify } from './utils';

class ProcessingInstruction extends CharacterData
{
	private _target: string;

	constructor(ownerDocument: Document, target: string, data: string)
	{
		super(ownerDocument, data);
		this._target = target;
	}

	get target()
	{
		return this._target;
	}

	set target(value)
	{
		this._target = stringify(value);
	}

	get nodeName()
	{
		return this._target;
	}

	get nodeType()
	{
		return NodeType.PROCESSING_INSTRUCTION_NODE;
	}
}

export default ProcessingInstruction;
