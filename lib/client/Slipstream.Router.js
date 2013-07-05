;
(function () {
	//	debug("Slipstream.Collection");

	Slipstream.Router = function (config, col) {
		var self = {
			_routes               :
				[
				],
			routeRoot             : '/' + config.name + '',
			routeRootPlural       : '/' + config.name.pluralize() + '',
			routeReferenceColumn   : ':' + config.referenceColumn + '',
			routeSessionReference : 'current' + _.capitalize(config.name) + 'Id',

			route                 : function (view, ref) {
				/* Such as /model/view/(_id) */
				var route = self.routeRoot + view;

				if (ref)
					route += '/' + ref;

				return route;
			},
			addRoute              : function (path, templateName, params, requiresLogin) {
				templateName = _.capitalize(templateName.toLowerCase());
				if (!self._routes[templateName]) {
					self._routes[templateName] = path;

					var curTemplate = config.name + templateName;

					//						if (path)
					//							path = '/' + path;

					params = params || {};

					Meteor.Router.add(self.routeRoot + path, _.extend(params, {
						to : curTemplate
					}));
					Meteor.Router.add(self.routeRootPlural + path, _.extend(params, {
						to : curTemplate
					}));

					//					debug("addRoute: route = " + self.routeRoot + path + ", template = " + curTemplate);
					//					debug("addRoute: route = " + self.routeRootPlural + path + ", template = " + curTemplate);

					if (templateName == 'Create' || templateName == 'Update' || templateName == 'Delete'
						|| requiresLogin === true)
						Meteor.Router.filter('requireLogin', {only : curTemplate});
				}
			},
			addRouteWithReference : function (path, templateName, params, requiresLogin) {
				self.addRoute('/' + self.routeReferenceColumn + path, templateName, params, requiresLogin);
			},
			sessionId             : function () {
				var result = Session.get(self.routeSessionReference);
				//debug("session "+Session);
				//debug("sessionId result "+result);
				return result || '';
			},
			loadBySession         : function (forceReload) {
				if (self.sessionId() && !col.columns._id.value || forceReload === true) {
					var where = {};
					//				Object.defineProperty(where, config.referenceColumn, {value : self.sessionId()});
					where[config.referenceColumn] = self.sessionId();
					//				var where = [];
					//				where[config.referenceColumn] = self.sessionId();
					//				debug("loadBySession: where = " + JSON.stringify(where) + ", refField = " + config.referenceColumn
					//					+ ', sessionId = ' + self.sessionId());

					var result;
					try {
						result = col.findOne(where);
						col.loadValues(result);
					}
					catch (e) {
						//						debug("loadBySession : error encountered: " + e.reason);
					}
					finally {
						//						debug("loadBySession result = " + JSON.stringify(result) + ", typeof findOne = "
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
		self.addRoute('', 'List');
		//			self.addRoute(name.pluralize(), 'List');
		self.addRoute('create', 'Create', {
		});
		self.addRouteWithReference('', 'View', {
			and : function (ref) { Session.set(self.routeSessionReference, ref); }
		});
		self.addRouteWithReference('/update', 'Update', {
			and : function (ref) { Session.set(self.routeSessionReference, ref); }
		});
		self.addRouteWithReference('/delete', 'Delete', {
			and : function (ref) { Session.set(self.routeSessionReference, ref); }
		});

		//	Meteor.Router.filter('requireLogin', {only : 'postSubmit'});

		return self;
	};
}());
