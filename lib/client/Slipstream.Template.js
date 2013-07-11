;
(function () {
	Slipstream.Template = function (options, config, Col, Router, Session) {
		if (!_.isStirng(options.name))
			return Slipstream.throwError(601, "Unable to set up tempplate, messing essential name parameter");

		var self = _.extend(_.defaults(options, {
			helpers   : {},
			events    : {},
			created   : null,
			rendered  : null,
			destroyed : null,
			route     : {},
			success   : null,
			error     : null
		}), {
			nameLower       : options.name.toLowerCase(),
			nameCapitalized : options.name.toLowerCase(),
			get             : function () {
				// The template object leveraged here is the global namespaced Meteor.Template
				var templateName = config.name + self.nameCapitalized,
					result = !_.isUndefined(Template) ? Template[templateName] : null;

				if (config.checkDebug('client', 'template')) // Given the way this is leveraged, this can only display if the global debug flag is enabled
					Slipstream.debug("template::getTemplate = " + templateName);

				return result;
			},
			initialization  : _.once(function () {
				// Ensure the template name is set as a capitalized string
				var curTemplate = self.get();

				if (!_.has(self.route, 'template'))
					self.route.template = self.nameCapitalized;

				curTemplate.helpers(self.helpers);
				curTemplate.events(self.events);
				curTemplate.created = self.created;
				curTemplate.rendered = self.rendered;
				curTemplate.destroyed = self.destroyed;

				Router.addRoute(self.route);
			})
		});

		self.initialization();

		return self;
	};
}());
