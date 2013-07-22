;
(function () {
	/*
	 ### `Slipstream.Router(config, Col)`
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
	 > `Session` - object
	 > An instance of the [Slipstream.Session]{https://github.com/blitzcodes/slipstream-mrt/wiki/Slipstream.Session) class configured for this Drift subclass.
	 */
	Slipstream.Router = function (config, Col, Session) {
		Slipstream.debug.groupCollapsed("Init Router");

		// The session object leveraged here is the slipstream object vs the global namespace Meteor.Session
		var routeName = config.name,
			self = {
				_routes              :
					[
					],
				routeName            : routeName,
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
				addRoute : function (options) {
					if (!_.isObject(options))
						return Slipstream.debug.throwError(601,
							'Invalid route options specified: options json is blank');

					_.defaults(options, {
						path         : '',
						template     : '',
						requireLogin : true
						//						as           : '',
						//						to           : '',
						//						and          : {}
					});

					var route = '',
						params = _.pick(options, 'as', 'to', 'and'); // For the commands we're passing to the Meteor Router, we only desire the original parameters, scrub the rest;

					if (options.template) {
						options.template = _.capitalize(options.template.toLowerCase());
						route = routeName + options.template;
					}

					if (route) {
						if (!params.as)
							params.as = route;
						if (!params.to)
							params.to = route;
					}

					if (options.useRef === true) {
						if (options.path)
							options.path = '/' + options.path;

						options.path = self.routeReferenceColumn + options.path;
						_.defaults(params, {
							and : function (ref) {
								Session.sessionId(ref);

								config.debug(
									[
										'client',
										'router'
									],
									'Router.open(...) - Options.template Name = "' + options.template + '", ref value = "' + ref + '"');
							},
							to  : route
						});
					}

					if (options.path)
						options.path = '/' + options.path;

					if (_.isUndefined(params.to))
						return Slipstream.debug.throwError(601,
							'Invalid route options specified: params = ' + _.stringify(params));
					if (!self._routes[options.path]) {
						self._routes[options.path] = options.template;

						Meteor.Router.add(self.routeRoot + options.path, params);

						if (self.routesPluralized) {
							Meteor.Router.add(self.routeRootPlural + options.path, params);
						}

						if ((options.requireLogin || config.options.requireUserId) && ( options.template == 'Create'
							|| options.template
							== 'Update' || options.template
							== 'Delete')) {
							Meteor.Router.filter('requireLogin', {only : route});
						}

					}

					config.debug(
						[
							'init',
							'client',
							'router'
						],
						'Router.addRoute(...)',
						'route = "' + (self.routeRoot + options.path) + '"' + (self.routesPluralized ? ', pluralized = "'
							+ (self.routeRootPlural + options.path) + '"' : ''),
						'params {} = ', params, 'routeOptions {} = ', options);

					return true;
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

		_.each(config.routes, function (options) {
			self.addRoute(options);
		});

		Slipstream.debug.groupEnd();

		return self;
	};
}());
