;
(function () {
	/*
	 ### `Slipstream.TemplateManager(config, Col, Router, Session)`
	 > Type: Class, Returns: Object

	 #### Description
	 > A subclass of the [Slipstream.Drift]{https://github.com/blitzcodes/slipstream-mrt/wiki/Slipstream.Drift).

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
	Slipstream.TemplateManager = function (config, Col, Router, Session) {
		var self = {
			templates              : {
			},
			addTemplate            : function (templateName, options) {
				_.extend(options, {
					name : templateName
				});
				self.templates[templateName] = Slipstream.Template(options, config, Col, Router, Session);
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
				var templates = {};
				// The intention to wait until meteor has started up for this, is to ensure that the client side templates will
				// function as expected, else their 'this' context may not function correctly.
				templates.List = _.defaults(config.templates.List || config.templates.list || {}, {
					helpers  : {
						items : function () {
							var sort = (Col.useDefaultDateFields === true) ? {sort : {dateModified : -1}} : {},
								result = Col.find({}, sort);
							return result;
						}
					},
					rednered : function () {
						Slipstream.log.reset();
					}
				});
				templates.View = _.defaults(config.templates.View || config.templates.view || {}, {
					helpers : {
//						columns : self.renderColumnsBySession,
						values  : self.renderValuesBySession
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
				templates.Create = _.defaults(config.templates.Create || config.templates.create || {}, {
					helpers : {
						inputs : self.renderInputsBySession
					},
					route   : {
						path : 'create'
					}
				});
				templates.Update = _.defaults(config.templates.Update || config.templates.update || {}, {
					helpers : {
						inputs : self.renderInputsBySession
					},
					route   : {
						path   : 'update',
						useRef : true
					}
				});
				templates.Delete = _.defaults(config.templates.Delete || config.templates.delete || {}, {
					helpers : {
						inputs : self.renderInputsBySession
					},
					route   : {
						path   : 'delete',
						useRef : true
					}
				});

				config.debug("template::templateOptions = " + _.stringify(templates),
					'client', 'init', 'template');

				_.each(templates, function (options, templateName) {
					self.addTemplate(templateName, options);

				});

				config.debug("template::final templates created = " + _.keys(self.templates),
					'client', 'init', 'template');
			})
		};

		self.initialization();

		return self;
	};
}());
