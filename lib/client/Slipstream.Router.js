;
(function () {
	//	debug("Slipstream.Collection");

	Slipstream.Router = function (col, options) {
		var self = {
			_routes               :
				[
				],
			routeRoot             : '/' + options.name + '',
			routeRootPlural       : '/' + options.name.pluralize() + '',
			routeReferenceField   : ':' + options.referenceField + '',
			routeSessionReference : 'current' + options.name.ucwords() + 'Id',

			route                 : function (view, ref) {
				/* Such as /model/view/(_id) */
				var route = self.routeRoot + view;

				if (ref)
					route += '/' + ref;

				return route;
			},
			addRoute              : function (path, templateName, params, requiresLogin) {
				templateName = _.capitalize(templateName);
				if (!self._routes[templateName]) {
					self._routes[templateName] = path;

					var curTemplate = options.name + templateName;

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
				self.addRoute('/' + self.routeReferenceField + path, templateName, params, requiresLogin);
			},
			sessionId             : function () {
				return Session.get(self.routeSessionReference);
			},
			loadBySession         : function (forceReload) {
				if (!col.columns._id.value || forceReload === true) {
					var where = {};
					//				Object.defineProperty(where, options.referenceField, {value : self.sessionId()});
					where[options.referenceField] = self.sessionId();
					//				var where = [];
					//				where[options.referenceField] = self.sessionId();
					//				debug("loadBySession: where = " + JSON.stringify(where) + ", refField = " + options.referenceField
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
