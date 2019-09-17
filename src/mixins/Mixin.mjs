export default function Mixin(mixin)
{
	const key = Symbol(mixin.name);
	const creator = superclass =>
	{
		// avoid mixing in multiple times
		if (superclass.prototype[key])
		{
			return superclass;
		}

		// use cached classes from previous applications if available
		if (superclass.hasOwnProperty(key))
		{
			return superclass[key];
		}

		// create the subclass
		const application = mixin(superclass);

		// create its cache entry
		superclass[key] = application;

		// set a flag on the prototype for superfast mixin presence checks
		Object.defineProperty(application.prototype, key, { value : true });
		return application;
	};

	return creator;
}
