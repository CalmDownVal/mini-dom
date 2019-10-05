import Node from './Node';
import NodeType from './NodeType';

export function callback(instance: { [index: string]: any }, name: string, ...args: any[])
{
	const fn = instance[name];
	if (typeof fn === 'function')
	{
		fn.call(instance, ...args);
	}
}

export function isElement(node: Node)
{
	return node.nodeType === NodeType.ELEMENT_NODE;
}

export function splitName(name: string)
{
	const index = name.indexOf(':');
	return index > 0 && index !== name.length
		? [ name.slice(0, index), name.slice(index + 1) ]
		: [ null, name ];
}

export function stringify(value: any, allowEmpty: boolean = false): string
{
	switch (typeof value)
	{
		case 'symbol':
			value = value.toString();
			break;

		case 'object':
			if (value === null)
			{
				value = '';
				break;
			}
			// fall-through

		default:
			value = '' + value;
			break;
	}

	if (value === '' && !allowEmpty)
	{
		throw new Error('invalid empty string');
	}

	return value;
}
