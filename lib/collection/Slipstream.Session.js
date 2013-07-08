;
(function () {
	Slipstream.Session = function (config, col) {
		// The session object leveraged here is the global namespaced Meteor.Session
		var self = {
			sessionId     : function (value) {
				if (!_.isUndefined(value))
					Session.set(config.sessionReference, value);

				var result = Session.get(config.sessionReference) || '';

				if (config.debug.session === true && Meteor.isClient)
					Slipstream.debug("session::sessionId - result = " + result);

				return result;
			},
			loadBySession : function (forceReload) {
				if (self.sessionId() && !col.columns._id.value || forceReload === true) {
					var where = {},
						result;

					where[config.referenceColumn] = self.sessionId();

					if (config.debug.session === true && Meteor.isClient) {
						Slipstream.debug("loadBySession: where = " + JSON.stringify(where) + ", refField = "
							+ config.referenceColumn);
					}

					try {
						result = col.findOne(where);
						col.loadValues(result);
					}
					catch (e) {
						Slipstream.log.error(e.reason);
					}
					finally {
						//						Slipstream.debug("loadBySession result = " + JSON.stringify(result) + ", typeof findOne = "
						//							+ ( typeof self.findOne == 'function'));
					}
				}
			}
		};

		return self;
	};
}());
