;
(function () {
	Slipstream.Template = function (config, col, router, render) {
		var getTemplate = function (type) {
			var templateName = config.name + _.capitalize(type),
				result = !_.isUndefined(Template) ? Template[templateName] : null;

			if (config.debug.template === true && config.debug.init === true && Meteor.isClient)
				Slipstream.debug("template::getTemplate = " + templateName);

			return result;
		}, self = {
			/***************************
			 TEMPLATE Attributes & Methods
			 ****************************/
			template               : function (type) {
				return getTemplate(type);
			},
			templates              : {
				//				List   : getTemplate('List'),
				//				View   : getTemplate('View'),
				//				Create : getTemplate('Create'),
				//				Update : getTemplate('Update'),
				//				Delete : getTemplate('Delete')
			},
			loadValuesFromTemplate : function (t) {
				var data = {};
				_.each(col.columns, function (value, key, list) {
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

				//				if (config.debug.template === true && Meteor.isClient)
				//					Slipstream.debug("template::submitForm - template.data " + JSON.stringify(t.data));

				Meteor.call(config.name, data, function (err, id) {
					if (err) {
						Slipstream.log.error(err.error + " : " + err.reason); // display the error to the user

						if (err.error === 302) // if the error is that the post already exists, take us there
							;//Meteor.Router.to('postPage', error.details)
					}
					else {
						//Meteor.Router.to('postPage', id);
					}
				});
			},
			processTemplates       : function () {
				// The intention to wait until meteor has started up for this, is to ensure that the client side templates will
				// function as expected, else their 'this' context may not function correctly.
				self.templateOptions = _.extend(config.templates, {
					List   : {
						helpers : {
							items : function () {
								var sort = (col.useDefaultDateFields === true) ? {sort : {dateCreated : -1}} : {},
									result = col.find({}, sort);
								return result;
							}
						},
						events  : {
						}
					},
					View   : {
						helpers : {
							columns : render.renderColumnsBySession,
							values  : render.renderValuesBySession
						},
						events  : {
						},
						route   : {
							useRef : true
						}
					},
					Create : {
						helpers : {
							inputs : render.renderInputsBySession
						},
						events  : {
							'submit form' : self.submitForm
						},
						route   : {
							path : 'create'
						}
					},
					Update : {
						helpers : {
							inputs : render.renderInputsBySession
						},
						events  : {
							'submit form' : self.submitForm
						},
						route   : {
							path   : 'update',
							useRef : true
						}
					},
					Delete : {
						helpers : {
							inputs : render.renderInputsBySession
						},
						events  : {
							'submit form' : self.submitForm
						},
						route   : {
							path   : 'delete',
							useRef : true
						}
					}
				});

				if (config.debug.template === true && config.debug.init === true && Meteor.isClient)
					Slipstream.debug("template::templateOptions = " + JSON.stringify(self.templateOptions));

				_.each(self.templateOptions, function (template, templateName) {
					// Ensure the template name is set as a capitalized string
					var templateNameLower = templateName.toLowerCase(),
						templateNameCapitalized = _.capitalize(templateNameLower),
						curTemplate = getTemplate(templateNameCapitalized);

					_.defaults(template, {
						helpers   : {},
						events    : {},
						created   : null,
						rendered  : null,
						destroyed : null,
						route     : {}
					});

					if (!_.has(template.route, 'template'))
						template.route.template = templateNameCapitalized;

					curTemplate.helpers(template.helpers);
					curTemplate.events(template.events);
					curTemplate.created = template.created;
					curTemplate.rendered = template.rendered;
					curTemplate.destroyed = template.destroyed;

					router.addRoute(template.route);

					if (!_.has(self.templates, templateNameCapitalized))
						self.templates[templateNameCapitalized] = curTemplate;

				});

				if (config.debug.template === true && config.debug.init === true && Meteor.isClient)
					Slipstream.debug("template::final templates created = " + _.keys(self.templates));
			}
		};

		self.processTemplates();

		return self;
	};
}());
