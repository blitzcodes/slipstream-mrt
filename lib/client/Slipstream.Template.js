;
(function () {
	/*
	 ### `Slipstream.Template(config, Col, Router, Session)`
	 > Type: Class, Returns: Object

	 #### Description
	 > A subclass of the [Slipstream.TemplateManager]{https://github.com/blitzcodes/slipstream-mrt/wiki/Slipstream.TemplateManager).

	 #### Parameters
	 > `config` - JSON
	 > Please refer to [Slipstream.Drift Configuration]{https://github.com/blitzcodes/slipstream-mrt/wiki/Slipstream.Drift#configuration).
	 >
	 > `Col` - object
	 > An instance of the [Slipstream.Collection]{https://github.com/blitzcodes/slipstream-mrt/wiki/Slipstream.Collection) class configured for this Drift subclass.
	 >
	 > `Router` - object
	 > An instance of the [Slipstream.Router]{https://github.com/blitzcodes/slipstream-mrt/wiki/Slipstream.Router) class configured for this Drift subclass.
	 >
	 > `Session` - object
	 > An instance of the [Slipstream.Session]{https://github.com/blitzcodes/slipstream-mrt/wiki/Slipstream.Session) class configured for this Drift subclass.
	 */
	Slipstream.Template = function (options, config, Col, Router, Session) {
		if (_.isUndefined(options) || !_.isString(options.name))
			return Slipstream.debug.throwError(601, "Unable to set up template, messing essential name parameter");

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

					// Given the way this is leveraged, this can only display if the global debugging flag is enabled
					//					config.debug(
					//						[
					//							'client',
					//							'init',
					//							'template'
					//						], 'Template.get(...) - name = "' + templateName + '"');

					return result;
				},
				submitForm      : function (e, t) {
					e.preventDefault();

					var data = Col.loadByTemplate(t),
						result = false;

					Slipstream.debug.groupCollapsed("Template.SubmitForm on: " + self.nameCapitalized);

					config.debug(
						[
							'client',
							'template'
						], 'Template.submitForm(...)', 'template.data {} =', data);

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
									$('.btn').hide();
									_.delay(function () {
										Meteor.Router.to(config.name + "List", id);
									}, 2000);
								}
							});
						}
						catch (e) {
							Slipstream.log.error("There was an error processing your request:<br/>" + e.message);
						}
					}
					else
						Slipstream.log.error("Correct the following errors to proceed:<br/>"
							+ Col.errors.join("<br/>"));

					return result;
				},
				submitFormWithData      : function (e, data) {
					e.preventDefault();

					var data = Col.loadByObject(data),
						result = false;

					Slipstream.debug.groupCollapsed("Template.SubmitForm on: " + self.nameCapitalized);

					config.debug(
						[
							'client',
							'template'
						], 'Template.submitForm(...)', 'template.data {} =', data);

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
									$('.btn').hide();
									_.delay(function () {
										Meteor.Router.to(config.name + "List", id);
									}, 2000);
								}
							});
						}
						catch (e) {
							Slipstream.log.error("There was an error processing your request:<br/>" + e.message);
						}
					}
					else
						Slipstream.log.error("Correct the following errors to proceed:<br/>"
							+ Col.errors.join("<br/>"));

					return result;
				},
				removeEntry     : function () {
					var data = Session.loadBySession(),
						result = false;

					config.debug(
						[
							'client',
							'template'
						], 'Template.removeEntry(...)', 'template.data {} =', data);

					if (Col.hasId()) {
						try {
							result = Meteor.call(config.name + "Remove", data, function (err, id) {
								if (err) {
									if (err.error === 302) // if the error is that the post already exists, take us there
										;//Meteor.Router.to('postPage', error.details)
									else
										Slipstream.log.error("There was an error deleting your entry: " + err.error
											+ " : " + err.reason); // display the error to the user
								}
								else {
									Meteor.Router.to(config.name + "List");
								}
							});
						}
						catch (e) {
							Slipstream.log.error("There was an error deleting your entry:<br/>" + e.message);
						}
					}
					else
						Slipstream.log.error("There was an error deleting your entry, please try again.");

					return result;
				},
				initialization  : _.once(function () {
					// Ensure the template name is set as a capitalized string
					var curTemplate = self.get();

					if (curTemplate) {

						if (!_.has(self.route, 'template'))
							self.route.template = self.nameCapitalized;

						if (self.nameLower == 'create' || self.nameLower == 'update') {
							_.defaults(self.events, {
								'submit form' : self.submitForm
							});
						}
						else if (self.nameLower == 'remove') {
							_.defaults(self.events, {
								'submit form' : self.removeEntry
							});
							self.created = function () {
								self.removeEntry();
							}
						}
						//
						//					self.helpers['refCol'] = function () {
						////						return Col.getRefId();
						//						return options.referenceColumn;
						//					};

						curTemplate.helpers(self.helpers);
						curTemplate.events(self.events);
						curTemplate.created = self.created;
						curTemplate.rendered = self.rendered;
						curTemplate.destroyed = self.destroyed;
					}
					else {
						Slipstream.debug.throwError(602,
							"Unble to find HTML template for: " + config.name + templateName);
						self = {};
					}

					//					Router.addRoute(self.route);
				})
			});

		self.initialization();

		return self;
	};
}());
