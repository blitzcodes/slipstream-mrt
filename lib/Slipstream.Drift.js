;
(function () {
	Slipstream.Drift = function (config) {
		if (!_.isString(config.name) || !_.isObject(config.columns))
			Slipstream.throwError(601, "Object creation not possible, missing essential parameters name & columns.");

		// Ensure the default parameters are all set if they were not initialized
		_.defaults(config, {
			referenceColumn  : '_id',
			sessionReference : 'current' + _.capitalize(config.name) + 'Id',
			templates        : {},
			routes           :
				[
				],
			process          : null,
			postProcess      : null,
			validate         : null

		});

		// Todo: set up permission controls that will affect the allow/deny and final post back calls
		config.permissions = config.permissions || {};
		_.defaults(config.permissions, {
			insert : true,
			update : true,
			delete : true,
			list   : true,
			view   : true
		});

		// Configure the default set of object options if they were not initialized
		config.options = config.options || {};
		_.defaults(config.options, {
			requireUserId        : true,
			routesPluralized     : true,
			useDefaultDateFields : true
		});

		// By default, disable all types of debugging, only leverage explicit use per object
		config.debug = config.debug || {};
		_.defaults(config.debug, {
			init       : false,
			collection : false,
			method     : false,
			router     : false,
			session    : false,
			template   : false
		});

		config.name = _.trim(config.name.toLowerCase());
		config.referenceColumn = _.trim(config.referenceColumn.toLowerCase());

		var self = {},
			Col = Slipstream.Collection(config),
			Method = Slipstream.Method(config, Col);

		_.extend(self, Col, Method);

		if (Meteor.isClient) {
			var Session = Slipstream.Session(config, Col), // The session object leveraged here is the slipstream object vs the global namespaced Meteor.Session
				Router = Slipstream.Router(config, Col, Session),
				Template = Slipstream.Template(config, Col, Router, Session); // The template object leveraged here is the slipstream object vs the global namespaced Meteor.Template

			_.extend(self, Session, Router, Template);
		}

		return self;
	};
}());
