;
(function () {
	Slipstream.TemplateManager = function (config, Col, Router, Session) {
		var tempalteOptions = {},
			self = {
			templates              : {
			},
			addTemplate            : function (name, options) {
				self.templates[name] = Slipstream.Template(options, config, Col, Router, Session);
			},
			loadValuesFromTemplate : function (t) {
				var data = {};
				_.each(Col.columnNames(), function (column) {
					var found = t.find("#" + column);
					if (found)
						data[column] = found.value;
				});

				//				if (config.checkDebug('client','template'))
				//					Slipstream.debug("template::loadValuesFromTemplate - data " + _.stringify(data));

				return data;
			},
			submitForm             : function (e, t) {
				e.preventDefault();

				var data = self.loadValuesFromTemplate(t),
					result = false;

				if (config.checkDebug('client','template'))
					Slipstream.debug("template::submitForm - template.data " + _.stringify(data));

				if (Col.validate(data)) {
					try {
						result = Meteor.call(config.name, data, function (err, id) {
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
					catch (e) {
						Slipstream.log.error("There was an error processing your request:<br/>" + e.message);
					}
				}
				else
					Slipstream.log.error("Correct the following errors:<br/>" + Col.errors.join("<br/>"));

				return result;
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
			},
			initialization         : _.once(function () {
				// The intention to wait until meteor has started up for this, is to ensure that the client side templates will
				// function as expected, else their 'this' context may not function correctly.
				tempalteOptions.List = _.defaults(config.templates.List || config.templates.list || {}, {
					helpers : {
						items : function () {
							var sort = (Col.useDefaultDateFields === true) ? {sort : {dateModified : -1}} : {},
								result = Col.find({}, sort);
							return result;
						}
					},
					events  : {
					}
				});
				tempalteOptions.View = _.defaults(config.templates.View || config.templates.view || {}, {
					helpers : {
						columns : self.renderColumnsBySession,
						values  : self.renderValuesBySession
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
				tempalteOptions.Create = _.defaults(config.templates.Create || config.templates.create || {}, {
					helpers : {
						inputs : self.renderInputsBySession
					},
					events  : {
						'submit form' : self.submitForm
					},
					route   : {
						path : 'create'
					}
				});
				tempalteOptions.Update = _.defaults(config.templates.Update || config.templates.update || {}, {
					helpers : {
						inputs : self.renderInputsBySession
					},
					events  : {
						'submit form' : self.submitForm
					},
					route   : {
						path   : 'update',
						useRef : true
					}
				});
				tempalteOptions.Delete = _.defaults(config.templates.Delete || config.templates.delete || {}, {
					helpers : {
						inputs : self.renderInputsBySession
					},
					events  : {
						'submit form' : self.submitForm
					},
					route   : {
						path   : 'delete',
						useRef : true
					}
				});

				if (config.checkDebug('client','init','template'))
					Slipstream.debug("template::templateOptions = " + _.stringify(tempalteOptions));

				_.each(tempalteOptions, function (options, templateName) {
					self.addTemplate(_.extend(options, {
						name : templateName
					}));
				});

				if (config.checkDebug('client','init','template'))
					Slipstream.debug("template::final templates created = " + _.keys(self.templates));
			})
		};

		self.initialization();

		return self;
	};
}());
