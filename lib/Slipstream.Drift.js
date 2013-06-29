;
(function () {
	//debug("Slipstream.Drift");

	Slipstream.Drift = function (options) {
		if (typeof options.name !== 'string' || typeof options.columns !== 'object')
			throw new Meteor.Error(601, "Object creation not possible, missing essential parameters name & columns.");

		// Ensure name remains lower case
		options.name = _.trim(options.name.toLowerCase());

		// Ensure reference field remains lower case, if present
		if (typeof options.referenceField === 'string')
			options.referenceField = _.trim(options.referenceField.toLowerCase());

		var self = {
				name           : options.name,
				referenceField : options.referenceField || '_id'
			},
			col = Slipstream.Collection(options),
			method = Slipstream.Method(col);

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
