;
(function () {
	Slipstream.Drift = function (config) {
		if (!_.isString(config.name) || !_.isObject(config.columns))
			Slipstream.throwError(601, "Object creation not possible, missing essential parameters name & columns.");

		var defaults = Slipstream.defaults();

		// Ensure the default parameters are all set if they were not initialized
		_.defaults(config, {
			sessionReference : 'current' + _.capitalize(config.name) + 'Id'
		}, defaults);

		// Todo: set up permission controls that will affect the allow/deny and final post back calls
		config.permissions = config.permissions || {};
		_.defaults(config.permissions, defaults.permissions);

		// Configure the default set of object options if they were not initialized
		config.options = config.options || {};
		_.defaults(config.options, defaults.options);

		// By default, disable all types of debugging, only leverage explicit use per object
		if (config.debug !== false) {
			config.debug = config.debug || {};
			_.defaults(config.debug, defaults.debug);
		}
		else
			config.debug = {};

		config.name = _.trim(config.name.toLowerCase());
		config.referenceColumn = _.trim(config.referenceColumn.toLowerCase());

		var self = {},
			Col = Slipstream.Collection(config),
			Method = Slipstream.Method(config, Col);

		_.extend(self, Col, Method);

		if (Meteor.isClient) {
			var Session = Slipstream.Session(config, Col), // The session object leveraged here is the slipstream object vs the global namespaced Meteor.Session
				Router = Slipstream.Router(config, Col, Session),
				Template = Slipstream.TemplateManager(config, Col, Router, Session); // The template object leveraged here is the slipstream object vs the global namespaced Meteor.Template

			_.extend(self, Session, Router, Template);
		}

		return self;
	};
}());
