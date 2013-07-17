;
(function () {
	/*
	 ### `Slipstream.Session(config, Col)`
	 > Type: Class, Returns: Object

	 #### Description
	 > A subclass of the [Slipstream.Drift]{https://github.com/blitzcodes/slipstream-mrt/wiki/Slipstream.Drift).

	 #### Parameters
	 > `config` - JSON
	 > Please refer to [Slipstream.Drift Configuration]{https://github.com/blitzcodes/slipstream-mrt/wiki/Slipstream.Drift#configuration).
	 >
	 > `Col` - object
	 > An instance of the [Slipstream.Collection]{https://github.com/blitzcodes/slipstream-mrt/wiki/Slipstream.Collection) class configured for this Drift subclass.
	 */
	Slipstream.Session = function (config, Col) {
		// The session object leveraged here is the global namespaced Meteor.Session
		var self = {
			sessionId     : function (value) {
				if (!_.isUndefined(value))
					Session.set(config.sessionReference, value);

				var result = Session.get(config.sessionReference) || '';

				config.debug("session::sessionId - result = " + result, 'client', 'session');

				return result;
			},
			sessionEquals     : function (value) {
				var result = Session.equals(config.sessionReference, value) || '';

				config.debug("session::sessionEquals - result = " + result, 'client', 'session');

				return result;
			},
			loadBySession : function () {
				var where = {},
					result = {};

				if (self.sessionId()) {
					where[config.referenceColumn] = self.sessionId();

					config.debug(_.sprintf("loadBySession: where = %s, refField = %s",
						_.stringify(where), config.referenceColumn), 'client', 'session');

					try {
						result = Col.loadWhere(where);
					}
					catch (e) {
						config.debug("session::loadBySession - Error " + e.message, 'client', 'session');
					}
					finally {
						config.debug(_.sprintf("session::loadBySession - where = %s, result = %s",
							_.stringify(where), _.stringify(result)), 'client', 'session');
					}
				}
				return result;
			}
		};

		return self;
	};
}());
