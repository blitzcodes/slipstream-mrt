;
(function () {
	//	debug("Slipstream.Template");

	Slipstream.Template = function (config, col, router) {
		var getTemplate = function (type) {
			//			debug("Template = "+config.name + _.capitalize(type));
			return Template[config.name + _.capitalize(type)];
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
				List   : getTemplate('List'),
				View   : getTemplate('View'),
				Create : getTemplate('Create'),
				Update : getTemplate('Update'),
				Delete : getTemplate('Delete')
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
			}
		});

		// The intention to wait until meteor has started up for this, is to ensure that the client side templates will
		// function as expected, else their 'this' context may not function correctly.
		Meteor.startup(function () {
			self.templateOptions = config.templates;
			_.defaults(self.templateOptions, {
				List   : {
					helpers : {
						items : function () {
							return Project.find({}, {sort : {dateCreated : -1}});
						}
					},
					events  : {
					}
				},
				View   : {
					helpers : {
						columns : Project.renderColumnsBySession,
						values  : Project.renderValuesBySession
					},
					events  : {
					},
					route   : {
						useRef : true
					}
				},
				Create : {
					helpers : {
						inputs : Project.renderInputsBySession
					},
					events  : {
						'submit form' : Project.submitForm
					},
					route   : {
						path : 'create'
					}
				},
				Update : {
					helpers : {
						inputs : Project.renderInputsBySession
					},
					events  : {
						'submit form' : Project.submitForm
					},
					route   : {
						path   : 'update',
						useRef : true
					}
				},
				Delete : {
					helpers : {
						inputs : Project.renderInputsBySession
					},
					events  : {
						'submit form' : Project.submitForm
					},
					route   : {
						path   : 'delete',
						useRef : true
					}
				}
			});

			_.each(self.templateOptions, function (template, templateName) {
				// Ensure the template name is set as a capitalized string
				var templateNameLower = templateName.toLowerCase(),
					templateNameCapitalized = _.capitalize(templateNameLower),
					curTemplate = self.templates[templateNameCapitalized] = getTemplate(templateNameCapitalized);

				_.defaults(template.route, {
					template : templateNameCapitalized
				});

				_.each(template, function (value, option) {
					if (option == 'helpers' || option == 'events')
						curTemplate[option](value);
					else if (option == 'route') {
						router.addRoute(value);
					}
					else {
						curTemplate[option] = value;
					}
				});
			});
		});

		return self;
	};
}());
