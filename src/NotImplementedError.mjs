export default class NotImplementedError extends Error
{
	constructor(message)
	{
		super(message || 'method not implemented');
	}
}
