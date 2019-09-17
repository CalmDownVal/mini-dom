import Node from './Node.mjs';
import CharacterData from './CharacterData.mjs';
import { stringify } from './utils.mjs';

export default class ProcessingInstruction extends CharacterData
{
	#target;

	constructor(target)
	{
		super();
		this.target = target;
	}

	get target()
	{
		return this.#target;
	}

	set target(value)
	{
		this.#target = stringify(value, false, false);
	}

	get nodeName()
	{
		return this.#target;
	}

	get nodeType()
	{
		return Node.PROCESSING_INSTRUCTION_NODE;
	}
}
