;
(function () {
	//	debug("Slipstream.Collection");

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

	var RouterProto = {
		routes                :
			[
			],
		routeRoot             : function () { return '/' + this.name + ''; },
		routeRootPlural       : function () { return '/' + this.name.pluralize() + ''; },
		routeReferenceField   : function () { return ':' + this.referenceField + ''; },
		routeSessionReference : function () { return 'current' + this.name.ucwords() + 'Id'; },

		route                 : function (view, ref) {
			/* Such as /model/view/(_id) */
			var route = this.routeRoot + view;

			if (ref)
				route += '/' + ref;

			return route;
		},
		addRoute              : function (path, templateName, params, requiresLogin) {
			templateName = _.capitalize(templateName);
			if (!this.routes[templateName]) {
				this.routes[templateName] = path;

				//						if (path)
				//							path = '/' + path;

				params = params || {};

				Meteor.Router.add(this.routeRoot + path, _.extend(params, {
					to : name + templateName
				}));
				Meteor.Router.add(this.routeRootPlural + path, _.extend(params, {
					to : name + templateName
				}));

				//					debug("addRoute: route = " + this.routeRoot + path + ", template = " + name + templateName);
				//					debug("addRoute: route = " + this.routeRootPlural + path + ", template = " + name + templateName);

				if (templateName == 'Create' || templateName == 'Update' || templateName == 'Delete'
					|| requiresLogin === true)
					Meteor.Router.filter('requireLogin', {only : name + templateName});
			}
		},
		addRouteWithReference : function (path, templateName, params, requiresLogin) {
			this.addRoute('/' + this.routeReferenceField + path, templateName, params, requiresLogin);
		},
		sessionId             : function () {
			return Session.get(this.routeSessionReference);
		},
		loadBySession : function (forceReload) {
			if (!list.columns._id.value || forceReload === true) {
				var where = {};
				//				Object.defineProperty(where, this.referenceField, {value : this.sessionId()});
				where[this.referenceField] = this.sessionId();
				//				var where = [];
				//				where[this.referenceField] = this.sessionId();
				//				debug("loadBySession: where = " + JSON.stringify(where) + ", refField = " + this.referenceField
				//					+ ', sessionId = ' + this.sessionId());

				var result;
				try {
					result = this.findOne(where);
					this.loadValues(result);
				}
				catch (e) {
					//						debug("loadBySession : error encountered: " + e.reason);
				}
				finally {
					//						debug("loadBySession result = " + JSON.stringify(result) + ", typeof findOne = "
					//							+ ( typeof this.findOne == 'function'));
				}
			}
		}
	};
	Slipstream.Router = function (options) {
		var self = Object.create(RouterProto);

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

	//	Slipstream.Router = function (name, referenceField) {
	//
	//		Meteor.Router.filters({
	//			'requireLogin' : function (page) {
	//				if (Meteor.user())
	//					return page;
	//				else if (Meteor.loggingIn())
	//					return 'userLoading';
	//				else
	//					return 'userSignIn';
	//			}
	//		});
	//
	//		var self = {
	//			/***************************
	//			 ROUTE Attributes & Methods
	//			 ****************************/
	//			routes                :
	//				[
	//				],
	//			routeRoot             : '/' + name + '',
	//			routeRootPlural       : '/' + name.pluralize() + '',
	//			routeReferenceField   : ':' + referenceField + '',
	//			routeSessionReference : 'current' + name.ucwords() + 'Id',
	//
	//			route                 : function (view, ref) {
	//				/* Such as /model/view/(_id) */
	//				var route = this.routeRoot + view;
	//
	//				if (ref)
	//					route += '/' + ref;
	//
	//				return route;
	//			},
	//			addRoute              : function (path, templateName, params, requiresLogin) {
	//				templateName = _.capitalize(templateName);
	//				if (!this.routes[templateName]) {
	//					this.routes[templateName] = path;
	//
	//					//						if (path)
	//					//							path = '/' + path;
	//
	//					params = params || {};
	//
	//					Meteor.Router.add(this.routeRoot + path, _.extend(params, {
	//						to : name + templateName
	//					}));
	//					Meteor.Router.add(this.routeRootPlural + path, _.extend(params, {
	//						to : name + templateName
	//					}));
	//
	//					//					debug("addRoute: route = " + this.routeRoot + path + ", template = " + name + templateName);
	//					//					debug("addRoute: route = " + this.routeRootPlural + path + ", template = " + name + templateName);
	//
	//					if (templateName == 'Create' || templateName == 'Update' || templateName == 'Delete'
	//						|| requiresLogin === true)
	//						Meteor.Router.filter('requireLogin', {only : name + templateName});
	//				}
	//			},
	//			addRouteWithReference : function (path, templateName, params, requiresLogin) {
	//				this.addRoute('/' + this.routeReferenceField + path, templateName, params, requiresLogin);
	//			},
	//			sessionId             : function () {
	//				return Session.get(self.routeSessionReference);
	//			}
	//		};
	//
	//		/***************************
	//		 ROUTE Configuration - CVUD
	//		 /model/
	//		 /model/create
	//		 /model/:ref/View
	//		 /model/:ref/Update
	//		 /model/:ref/Delete
	//
	//		 ****************************/
	//		self.addRoute('', 'List');
	//		//			self.addRoute(name.pluralize(), 'List');
	//		self.addRoute('create', 'Create', {
	//		});
	//		self.addRouteWithReference('', 'View', {
	//			and : function (ref) { Session.set(self.routeSessionReference, ref); }
	//		});
	//		self.addRouteWithReference('/update', 'Update', {
	//			and : function (ref) { Session.set(self.routeSessionReference, ref); }
	//		});
	//		self.addRouteWithReference('/delete', 'Delete', {
	//			and : function (ref) { Session.set(self.routeSessionReference, ref); }
	//		});
	//
	//		//	Meteor.Router.filter('requireLogin', {only : 'postSubmit'});
	//
	//		return self;
	//	};
}());
