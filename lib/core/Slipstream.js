;
(function () {
	var defaults = {
		referenceColumn : '_id',
		templates       : {},
		routes          :
			[
			],
		process         : null,
		postProcess     : null,
		validate        : null,
		permissions     : {
			insert : true,
			update : true,
			delete : true,
			list   : true,
			view   : true
		},
		options         : {
			requireUserId        : true,
			routesPluralized     : true,
			useDefaultDateFields : true
		},
		debug           : {
			init       : false,
			collection : false,
			column     : false,
			method     : false,
			router     : false,
			session    : false,
			template   : false
		},
		checkDebug      : function () {
			var checks = true;

			//			Slipstream.debug("params here is " + _.stringify(params));
			//			Slipstream.debug("config.debug here is " + _.stringify(config.debug));

			_.each(arguments, function (key) {
				if (checks && key == 'client')
					checks = checks && Meteor.isClient;
				else if (checks && key == 'server')
					checks = checks && Meteor.isServer;
				else
					checks = checks && this.debug[key];
			});

			//			Slipstream.debug("check here is " + checks);

			return checks;
		}
	};

	Slipstream = {
		debugging : true,
		debug     : function (message) {
			if (Slipstream.debugging)
				Meteor._debug(message);
		},
		defaults  : function (data) {
			if (_.isObject(data))
				_.extend(defaults, data);

			return defaults;
		}
	};
}());
