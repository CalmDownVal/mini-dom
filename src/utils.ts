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

export function stringifyNull(value: any, allowEmpty: boolean = false)
{
	return value === null ? null : stringify(value, allowEmpty);
}
