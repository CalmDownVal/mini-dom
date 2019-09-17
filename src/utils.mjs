
import Node from './Node.mjs';

export function stringify(any, allowEmpty, allowNull)
{
	if (typeof any === 'string')
	{
		if (!allowEmpty && any === '')
		{
			throw new Error('Invalid empty string.');
		}
		return any;
	}
	else
	{
		if (allowNull && any === null)
		{
			return null;
		}
		return any !== null && any !== undefined && any.toString ? any.toString() : '' + any;
	}
}

export function isElement(node)
{
	return node.nodeType === Node.ELEMENT_NODE;
}
