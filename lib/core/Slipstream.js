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
