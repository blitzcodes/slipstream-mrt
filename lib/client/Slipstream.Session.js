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
		Slipstream.debug.groupCollapsed("Init Session");

		// The session object leveraged here is the global namespaced Meteor.Session
		var self = {
			sessionId     : function (value) {
				if (!_.isUndefined(value))
					Session.set(config.sessionReference, value);

				var result = Session.get(config.sessionReference) || '';

				config.debug(
					[
						'client',
						'session'
					], 'Session.sessionId(...) result = "' + result + '"');

				return result;
			},
			sessionEquals : function (value) {
				var result = Session.equals(config.sessionReference, value) || '';

				config.debug(
					[
						'client',
						'session'
					], 'Session.sessionEquals(...) result = "' + result + '"');

				return result;
			},
			loadBySession : function () {
				var where = {},
					result =
						[
						];

				Slipstream.debug.groupCollapsed("Session.loadBySession");

				if (where[config.referenceColumn] = self.sessionId()) {
					try {
						result = Col.loadWhere(where);
					}
					catch (e) {
						config.debug(
							[
								'client',
								'session'
							], 'Session.loadBySession(...) error = "' + e.message + '"');
					}
					finally {
						config.debug(
							[
								'client',
								'session'
							],
							"Session.loadBySession(...)", 'where {} = ', where, 'result {} = ', result);
					}
				}
				Slipstream.debug.groupEnd();
				return result;
			}
		};

		// Ensure we set the session id to null, as not to run into undefined results down the road...
		self.sessionId(null);

		Slipstream.debug.groupEnd();

		return self;
	};
}());
