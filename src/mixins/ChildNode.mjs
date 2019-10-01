import Mixin from './Mixin.mjs';
import Text from '../Text.mjs';

// since we can be passed strings, we need to convert them to Text nodes first
function asNode(obj)
{
	return typeof obj === 'string' ? new Text(obj) : obj;
}

export default Mixin(T => class extends T
{
	remove()
	{
		this.parentNode.removeChild(this);
	}

	before(...nodes)
	{
		for (const node of nodes)
		{
			this.parentNode.insertBefore(asNode(node), this);
		}
	}

	after(...nodes)
	{
		const next = this.nextSibling;
		for (const node of nodes)
		{
			this.parentNode.insertBefore(asNode(node), next);
		}
	}

	replaceWith(...nodes)
	{
		let i = nodes.length - 1;
		let prev = asNode(nodes[i]);

		const parent = this.parentNode;
		parent.replaceChild(prev, this);

		while (i !== 0)
		{
			const node = asNode(nodes[i--]);
			parent.insertBefore(node, prev);
			prev = node;
		}
	}
});
