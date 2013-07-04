;
(function () {
	//debug("Slipstream.Drift");

	Slipstream.Drift = function (options) {
		if (!_.isString(options.name) || !_.isObject(options.columns))
			throw new Meteor.Error(601, "Object creation not possible, missing essential parameters name & columns.");

		// Ensure name remains lower case
		options.name = _.trim(options.name.toLowerCase());

		if (_.isUndefined(options.requireUserId))
			options.requireUserId = true;

		// Ensure reference field remains lower case, if present
		if (_.isString(options.referenceField))
			options.referenceField = _.trim(options.referenceField.toLowerCase());
		else
			options.referenceField = '_id';

		var self = {},
			col = Slipstream.Collection(options),
			method = Slipstream.Method(col, options);

		//debug("Slipstream.Col & Method ok");

		self = _.extend(self, col, method);

		if (Meteor.isClient) {
			var template = Slipstream.Template(col, options),
				router = Slipstream.Router(col, options),
				render = Slipstream.Render(col, router);

			//debug("Slipstream.Client ok");

			self = _.extend(self, template, render, router);
		}

		return self;
	};
}());
