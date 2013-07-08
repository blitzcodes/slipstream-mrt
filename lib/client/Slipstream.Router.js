;
(function () {
	Slipstream.Router = function (config, col) {
		var self = {
			_routes               :
				[
				],
			routeRoot             : '/' + config.name + '',
			routeRootPlural       : '/' + config.name.pluralize() + '',
			routeReferenceColumn  : ':' + config.referenceColumn + '',
			routeSessionReference : 'current' + _.capitalize(config.name) + 'Id',

			route         : function (view, ref) {
				/* Such as /model/view/(_id) */
				var route = self.routeRoot + view;

				if (ref)
					route += '/' + ref;

				return route;
			},
			addRoute      : function (options) { // path, templateName, params, requireLogin
				var templateName = _.capitalize(options.template.toLowerCase()),
					path = options.path || '',
					params = options.params || {},
					requireLogin = options.requireLogin || config.requireUserId,
					templateRoute = config.name + templateName;

				if (options.useRef === true) {
					if (path)
						path = '/' + path;

					path = self.routeReferenceColumn + path;
					_.defaults(params, {
						and : function (ref) {
							Session.set(self.routeSessionReference, ref);
						}
					});
				}

				if (path)
					path = '/' + path;

				if (!self._routes[path]) {
					self._routes[path] = templateName;

					Meteor.Router.add(self.routeRoot + path, _.extend(params, {
						to : templateRoute
					}));
					if (config.routesPluralized === true) {
						Meteor.Router.add(self.routeRootPlural + path, _.extend(params, {
							to : templateRoute
						}));
					}

					if (config.debug.router === true && Meteor.isClient) {
						Meteor._debug("addRoute: route = " + self.routeRoot + path + ", template = " + templateRoute);
						if (config.routesPluralized === true)
							Meteor._debug("addRoute: route = " + self.routeRootPlural + path + ", template = "
								+ templateRoute);
					}

					if ((requireLogin === true) && ( templateName == 'Create' || templateName
						== 'Update' || templateName
						== 'Delete')) {
						Meteor.Router.filter('requireLogin', {only : templateRoute});
					}

				}
			},
			sessionId     : function () {
				var result = Session.get(self.routeSessionReference) || '';

				if (config.debug.session === true && Meteor.isClient)
					Meteor._debug("session::sessionId - result = " + result);

				return result;
			},
			loadBySession : function (forceReload) {
				if (self.sessionId() && !col.columns._id.value || forceReload === true) {
					var where = {},
						result;

					where[config.referenceColumn] = self.sessionId();

					if (config.debug.session === true && Meteor.isClient) {
						Meteor._debug("loadBySession: where = " + JSON.stringify(where) + ", refField = "
							+ config.referenceColumn + ', sessionId = ' + self.sessionId());
					}

					try {
						result = col.findOne(where);
						col.loadValues(result);
					}
					catch (e) {
						Slipstream.log.error(e.reason);
					}
					finally {
						//						Meteor._debug("loadBySession result = " + JSON.stringify(result) + ", typeof findOne = "
						//							+ ( typeof self.findOne == 'function'));
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
