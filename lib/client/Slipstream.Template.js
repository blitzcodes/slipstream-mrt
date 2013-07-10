;
(function () {
	Slipstream.Template = function (config, Col, Router, Render) {
		var getTemplate = function (type) {
			// The template object leveraged here is the global namespaced Meteor.Template
			var templateName = config.name + _.capitalize(type),
				result = !_.isUndefined(Template) ? Template[templateName] : null;

			if (config.debug.template === true && config.debug.init === true && Meteor.isClient)
				Slipstream.debug("template::getTemplate = " + templateName);

			return result;
		}, self = {
			/***************************
			 TEMPLATE Attributes & Methods
			 ****************************/
			templates              : {
			},
			loadValuesFromTemplate : function (t) {
				var data = {};
				_.each(Col.columnNames(), function (value, key, list) {
					var found = t.find("#" + value.name);
					if (found)
						data[value.name] = found.value;
					//						else
					//							data[value.name] = value.default;
				});
				return data;
			},
			submitForm             : function (e, t) {
				e.preventDefault();

				var data = self.loadValuesFromTemplate(t);

				if (Col.validateData(data)) {

					//				if (config.debug.template === true && Meteor.isClient)
					//					Slipstream.debug("template::submitForm - template.data " + JSON.stringify(t.data));

					Meteor.call(config.name, data, function (err, id) {
						if (err) {
							if (err.error === 302) // if the error is that the post already exists, take us there
								;//Meteor.Router.to('postPage', error.details)
							else
								Slipstream.log.error("There was an error submitting the form: " + err.error + " : "
									+ err.reason); // display the error to the user
						}
						else {
							//Meteor.Router.to('postPage', id);
						}
					});
				}
			},
			renderColumnsBySession : function (forceReload) {
				var result =
					[
					];
				if (Meteor.isClient) {
					Session.loadBySession(forceReload);
					result = Col.getColumns();
				}
				return result;
			},
			renderInputsBySession  : function (forceReload) {
				var result =
					[
					];
				if (Meteor.isClient) {
					Session.loadBySession(forceReload);
					result = Col.getInputs();
				}
				return result;
			},
			renderValuesBySession  : function (forceReload) {
				var result =
					[
					];
				if (Meteor.isClient) {
					Session.loadBySession(forceReload);
					result = Col.loadValues();
				}
				return result;
			}
		};

		var initialization = function () {
			// The intention to wait until meteor has started up for this, is to ensure that the client side templates will
			// function as expected, else their 'this' context may not function correctly.
			self.templateOptions = {};

			self.templateOptions.List = _.defaults(config.templates.List || config.templates.list || {}, {
				helpers : {
					items : function () {
						var sort = (Col.useDefaultDateFields === true) ? {sort : {dateCreated : -1}} : {},
							result = Col.find({}, sort);
						return result;
					}
				},
				events  : {
				}
			});
			self.templateOptions.View = _.defaults(config.templates.View || config.templates.view || {}, {
				helpers : {
					columns : Render.renderColumnsBySession,
					values  : Render.renderValuesBySession
				},
				events  : {
				},
				route   : {
					useRef : true,
					to     : function (ref) {
						if (ref == 'create') // exclude displaying an object when we're accessing the creat path
							return Router.routeName + 'Create';
						else
							return Router.routeName + 'View';
					}
				}
			});
			self.templateOptions.Create = _.defaults(config.templates.Create || config.templates.create || {}, {
				helpers : {
					inputs : Render.renderInputsBySession
				},
				events  : {
					'submit form' : self.submitForm
				},
				route   : {
					path : 'create'
				}
			});
			self.templateOptions.Update = _.defaults(config.templates.Update || config.templates.update || {}, {
				helpers : {
					inputs : Render.renderInputsBySession
				},
				events  : {
					'submit form' : self.submitForm
				},
				route   : {
					path   : 'update',
					useRef : true
				}
			});
			self.templateOptions.Delete = _.defaults(config.templates.Delete || config.templates.delete || {}, {
				helpers : {
					inputs : Render.renderInputsBySession
				},
				events  : {
					'submit form' : self.submitForm
				},
				route   : {
					path   : 'delete',
					useRef : true
				}
			});

			if (config.debug.template === true && config.debug.init === true && Meteor.isClient)
				Slipstream.debug("template::templateOptions = " + JSON.stringify(self.templateOptions));

			_.each(self.templateOptions, function (options, templateName) {
				// Ensure the template name is set as a capitalized string
				var templateNameLower = templateName.toLowerCase(),
					templateNameCapitalized = _.capitalize(templateNameLower),
					curTemplate = getTemplate(templateNameCapitalized);

				_.defaults(options, {
					helpers   : {},
					events    : {},
					created   : null,
					rendered  : null,
					destroyed : null,
					route     : {}
				});

				if (!_.has(options.route, 'template'))
					options.route.template = templateNameCapitalized;

				curTemplate.helpers(options.helpers);
				curTemplate.events(options.events);
				curTemplate.created = options.created;
				curTemplate.rendered = options.rendered;
				curTemplate.destroyed = options.destroyed;

				Router.addRoute(options.route);

				if (!_.has(self.templates, templateNameCapitalized))
					self.templates[templateNameCapitalized] = curTemplate;

			});

			if (config.debug.template === true && config.debug.init === true && Meteor.isClient)
				Slipstream.debug("template::final templates created = " + _.keys(self.templates));
		};
		initialization();

		return self;
	};
}());
