;
(function () {
	//debug("Slipstream.Drift");

	Slipstream.Drift = function (config) {
		if (!_.isString(config.name) || !_.isObject(config.columns))
			throw new Meteor.Error(601, "Object creation not possible, missing essential parameters name & columns.");

		_.defaults(config, {
			requireUserId  : true,
			referenceColumn : '_id'
		});

		config.name = _.trim(config.name.toLowerCase());
		config.referenceColumn = _.trim(config.referenceColumn.toLowerCase());

		var self = {},
			col = Slipstream.Collection(config),
			method = Slipstream.Method(config, col);

		//debug("Slipstream.Col & Method ok");

		self = _.extend(self, col, method);

		if (Meteor.isClient) {
			var router = Slipstream.Router(config, col),
				template = Slipstream.Template(config, col, router),
				render = Slipstream.Render(config, col, router);

			//debug("Slipstream.Client ok");

			self = _.extend(self, router, template, render);
		}

		return self;
	};
}());
