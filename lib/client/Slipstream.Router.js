;
(function () {
	//	debug("Slipstream.Collection");

	Slipstream.Router = function (col, options) {
		var self = {
			_routes               :
				[
				],
			routeRoot             : function () { return '/' + options.name + ''; },
			routeRootPlural       : function () { return '/' + options.name.pluralize() + ''; },
			routeReferenceField   : function () { return ':' + options.referenceField + ''; },
			routeSessionReference : function () { return 'current' + options.name.ucwords() + 'Id'; },

			route                 : function (view, ref) {
				/* Such as /model/view/(_id) */
				var route = this.routeRoot + view;

				if (ref)
					route += '/' + ref;

				return route;
			},
			addRoute              : function (path, templateName, params, requiresLogin) {
				templateName = _.capitalize(templateName);
				if (!this._routes[templateName]) {
					this._routes[templateName] = path;

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
			loadBySession         : function (forceReload) {
				if (!col.columns._id.value || forceReload === true) {
					var where = {};
					//				Object.defineProperty(where, options.referenceField, {value : this.sessionId()});
					where[options.referenceField] = this.sessionId();
					//				var where = [];
					//				where[options.referenceField] = this.sessionId();
					//				debug("loadBySession: where = " + JSON.stringify(where) + ", refField = " + options.referenceField
					//					+ ', sessionId = ' + this.sessionId());

					var result;
					try {
						result = this.findOne(where);
						col.loadValues(result);
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
