;
(function () {
	Slipstream.Drift = function (config) {
		if (!_.isString(config.name) || !_.isObject(config.columns)) {
			Slipstream.throwError(601, "Object creation not possible, missing essential parameters name & columns.");
		}

		// Ensure the default parameters are all set if they were not initialized
		_.defaults(config, {
			referenceColumn  : '_id',
			sessionReference : 'current' + _.capitalize(config.name) + 'Id',
			templates        : {},
			routes           :
				[
				]

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
			useDefaultDateFields : true,
			updateableColumns    :
				[
				]
		});

		// By default, disable all types of debugging, only leverage explicit use per object
		config.debug = config.debug || {};
		_.defaults(config.debug, {
			init       : false,
			collection : false,
			method     : false,
			render     : false,
			router     : false,
			session    : false,
			template   : false
		});

		config.name = _.trim(config.name.toLowerCase());
		config.referenceColumn = _.trim(config.referenceColumn.toLowerCase());

		var self = {},
			col = Slipstream.Collection(config),
			method = Slipstream.Method(config, col),
			session = Slipstream.Session(config, col); // The session object leveraged here is the slipstream object vs the global namespaced Meteor.Session

		_.extend(self, col, method);

		if (Meteor.isClient) {
			var router = Slipstream.Router(config, col, session),
				render = Slipstream.Render(config, col, router, session),
				template = Slipstream.Template(config, col, router, render);

			_.extend(self, session, router, template, render);
		}

		return self;
	};
}());
