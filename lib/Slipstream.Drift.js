;
(function () {
	//	debug("Slipstream.Drift");

	Slipstream.Drift = function (options) {
		var self = {
				name           : options.name,
				referenceField : options.referenceField || '_id'
			},
			col = Slipstream.Collection(options),
			method = Slipstream.Method(col, options);

		self = _.extend(self, col, method);

		if (Meteor.isClient) {
			var template = Slipstream.Template(col, options),
				router = Slipstream.Router(col, options),
				render = Slipstream.Render(col, router, options);

			self = _.extend(self, template, render, router);
		}

		return self;
	};
}());
