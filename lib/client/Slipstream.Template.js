;
(function () {
	//	debug("Slipstream.Template");

	Slipstream.Template = function (config, col, router, render) {
		var getTemplate = function (type) {
			//			debug("Template = " + config.name + _.capitalize(type));
			var templateName = config.name + _.capitalize(type),
				result = !_.isUndefined(Template) ? Template[templateName] : null;
			return result;
		}, self = Object.create({
			/***************************
			 TEMPLATE Attributes & Methods
			 ****************************/
			template               : function (type) {
				return getTemplate(type);
				//			debug("my name is " + this.name);
				//			return Template[this.name + type.ucwords()];
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

				//				debug("submitForm, My name is " + config.name);

				Meteor.call(config.name, data, function (err, id) {
					if (err) {
						Slipstream.Error.log(err.error + " : " + err.reason); // display the error to the user

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
				//				Meteor.startup(function () {
				self.templateOptions = config.templates || {};
				_.defaults(self.templateOptions, {
					List   : {
						helpers : {
							items : function () {
								var sort = (config.bypassDefaultFields !== true) ? {sort : {dateCreated : -1}} : {},
									result = col.find({}, sort);
								debug("items = " + JSON.stringify(result));
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

				//debug("templateOptions = " + JSON.stringify(self.templateOptions));

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

					//				debug("template.helpers.item = " + typeof template.helpers.items);
					//				debug("template options = " + JSON.stringify(template));

					if (!_.has(self.templates, templateNameCapitalized))
						self.templates[templateNameCapitalized] = curTemplate;

				});
				debug("Templates created = " + _.keys(self.templates));
				//				});
			}
		});

		self.processTemplates();

		return self;
	};
}());
