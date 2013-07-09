;
(function () {
	Slipstream.Router = function (config, col, session) {
		// The session object leveraged here is the slipstream object vs the global namespaced Meteor.Session
		var routeName = config.name,
			self = {
				_routes              :
					[
					],
				routesPluralized     : config.options.routesPluralized || true,
				routeRoot            : '/' + routeName + '',
				routeRootPlural      : '/' + routeName.pluralize() + '',
				routeReferenceColumn : ':' + config.referenceColumn + '',

				route    : function (view, ref) {
					/* Such as /model/view/(_id) */
					var route = self.routeRoot + view;

					if (ref)
						route += '/' + ref;

					return route;
				},
				addRoute : function (options) { // path, templateName, params, requireLogin
					var templateName = _.capitalize(options.template.toLowerCase()),
						path = options.path || '',
						params = options.params || {},
						requireLogin = options.requireLogin || config.options.requireUserId,
						templateRoute = routeName + templateName;

					if (options.useRef === true) {
						if (path)
							path = '/' + path;

						path = self.routeReferenceColumn + path;
						_.defaults(params, {
							and : function (ref) {
								session.sessionId(ref);
//								if (config.debug.router)
//									Slipstream.debug("router::addRoute - template Name = " + templateName + ", ref = "
//										+ ref);
							}
						});
					}

					if (path)
						path = '/' + path;

					if (!self._routes[path]) {
						self._routes[path] = templateName;

						var routeFunc = function (ref) {
							if (ref == 'create')
								return routeName + 'Create';
							else
								return routeName + 'View';
						};
						if (templateName == 'View') {
							templateRoute = routeFunc;
						}

						Meteor.Router.add(self.routeRoot + path, _.extend(params, {
							to : templateRoute
						}));
						if (self.routesPluralized === true) {
							Meteor.Router.add(self.routeRootPlural + path, _.extend(params, {
								to : templateRoute
							}));
						}

						if (config.debug.router === true && Meteor.isClient) {
							Slipstream.debug("addRoute: route = " + self.routeRoot + path + ", template = "
								+ templateRoute);
							if (self.routesPluralized === true)
								Slipstream.debug("addRoute: route = " + self.routeRootPlural + path + ", template = "
									+ templateRoute);
						}

						if ((requireLogin === true) && ( templateName == 'Create' || templateName
							== 'Update' || templateName
							== 'Delete')) {
							Meteor.Router.filter('requireLogin', {only : templateRoute});
						}

					}
				}
			};

		Meteor.Router.filters({
			'requireLogin' : function (page) {
				if (Meteor.user())
					return page;
				else if (Meteor.loggingIn())
					return 'userLoading';
				else
					return 'userSignIn';
			}
		});

		/***************************
		 ROUTE Configuration - CVUD
		 /model/
		 /model/create
		 /model/:ref/View
		 /model/:ref/Update
		 /model/:ref/Delete
		 ****************************/

			// These default routes should now be handled automatically view the template class
			//		self.addRoute({template : 'List'});
			//		self.addRoute({path : 'create', template : 'Create'});
			//		self.addRoute({template : 'View', useRef : true});
			//		self.addRoute({path : 'update', template : 'Update', useRef : true});
			//		self.addRoute({path : 'delete', template : 'Delete', useRef : true});

		_.each(config.routes, function (options) {
			self.addRoute(options);
		});

		return self;
	};
}());
