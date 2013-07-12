;
(function () {
	/*
	 ### `Slipstream.Drift(config)`
	 > Type: Class, Returns: Object

	 #### Description
	 >

	 #### Parameters
	 `config` - JSON
	 > The definition and configuration specific to the new Drift object that's being creating.  See [Slipstream.Drift Configuration]{https://github.com/blitzcodes/slipstream-mrt/wiki/Slipstream.Drift#configuration) for full details on the breadth of options to choose from when setting up a new Drift.
	 */
	Slipstream.Drift = function (setup) {
		if (!_.isString(setup.name) || !_.isObject(setup.columns))
			return Slipstream.throwError(601,
				"Drift creation not possible, missing essential parameters name & columns.");

		var self = {},
			config = Slipstream.Config(setup),
			Col = Slipstream.Collection(config),
			Method = Slipstream.Method(config, Col);

		_.extend(self, Col, Method);

		if (Meteor.isClient) {
			var Session = Slipstream.Session(config, Col), // The session object leveraged here is the slipstream object vs the global namespaced Meteor.Session
				Router = Slipstream.Router(config, Col, Session),
				Template = Slipstream.TemplateManager(config, Col, Router, Session); // The template object leveraged here is the slipstream object vs the global namespaced Meteor.Template

			_.extend(self, Session, Router, Template);
		}

		// Last but not least, in the event any of the config was altered during the class creation, late bind the config
		self.config = config;

		return self;
	};
}());
