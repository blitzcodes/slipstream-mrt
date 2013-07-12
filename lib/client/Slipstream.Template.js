;
(function () {
	/*
	 ### `Slipstream.Template(config, Col, Router, Session)`
	 > Type: Class, Returns: Object

	 #### Description
	 > A subclass of the [Slipstream.TemplateManager]{https://github.com/blitzcodes/slipstream-mrt/wiki/Slipstream.TemplateManager).

	 #### Parameters
	 `config` - JSON
	 > Please refer to [Slipstream.Drift Configuration]{https://github.com/blitzcodes/slipstream-mrt/wiki/Slipstream.Drift#configuration).

	 `Col` - object
	 > An instance of the [Slipstream.Collection]{https://github.com/blitzcodes/slipstream-mrt/wiki/Slipstream.Collection) class configured for this Drift subclass.

	 `Router` - object
	 > An instance of the [Slipstream.Router]{https://github.com/blitzcodes/slipstream-mrt/wiki/Slipstream.Router) class configured for this Drift subclass.

	 `Session` - object
	 > An instance of the [Slipstream.Session]{https://github.com/blitzcodes/slipstream-mrt/wiki/Slipstream.Session) class configured for this Drift subclass.
	 */
	Slipstream.Template = function (options, config, Col, Router, Session) {
		if (_.isUndefined(options) || !_.isString(options.name))
			return Slipstream.throwError(601, "Unable to set up template, messing essential name parameter");

		_.defaults(options, {
			helpers   : {},
			events    : {},
			created   : null,
			rendered  : null,
			destroyed : null,
			route     : {},
			success   : null,
			error     : null
		});

		var templateName = options.name,
			self = _.extend(options, {
				nameLower       : templateName.toLowerCase(),
				nameCapitalized : _.capitalize(templateName.toLowerCase()),
				get             : function () {
					// The template object leveraged here is the global namespaced Meteor.Template
					var templateName = config.name + self.nameCapitalized,
						result = !_.isUndefined(Template) ? Template[templateName] : null;

					if (config.checkDebug('client', 'template')) // Given the way this is leveraged, this can only display if the global debug flag is enabled
						Slipstream.debug("template::get - name = " + templateName);

					return result;
				},
				submitForm      : function (e, t) {
					e.preventDefault();

					var data = Col.loadByTemplate(t),
						result = false;

					if (config.checkDebug('client', 'template'))
						Slipstream.debug("template::submitForm - template.data " + _.stringify(data));

					if (Col.validate(data)) {
						try {
							result = Meteor.call(config.name, data, function (err, id) {
								if (err) {
									if (err.error === 302) // if the error is that the post already exists, take us there
										;//Meteor.Router.to('postPage', error.details)
									else
										Slipstream.log.error("There was an error submitting the form: " + err.error
											+ " : "
											+ err.reason); // display the error to the user
								}
								else {
									//Meteor.Router.to('postPage', id);
								}
							});
						}
						catch (e) {
							Slipstream.log.error("There was an error processing your request:<br/>" + e.message);
						}
					}
					else
						Slipstream.log.error("Correct the following errors:<br/>" + Col.errors.join("<br/>"));

					return result;
				},
				initialization  : _.once(function () {
					// Ensure the template name is set as a capitalized string
					var curTemplate = self.get();

					if (!_.has(self.route, 'template'))
						self.route.template = self.nameCapitalized;

					if (self.nameLower == 'create' || self.nameLower == 'update' || self.nameLower == 'delete') {
						_.defaults(self.events, {
							'submit form' : self.submitForm
						});
					}

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
