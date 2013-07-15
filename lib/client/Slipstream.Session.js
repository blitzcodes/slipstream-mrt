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
            sessionId: function (value) {
                if (!_.isUndefined(value))
                    Session.set(config.sessionReference, value);

                var result = Session.get(config.sessionReference) || '';

                //				if (config.checkDebug('client','session'))
                //					Slipstream.debug("session::sessionId - result = " + result);

                return result;
            },
            loadBySession: function (forceReload) {
                var where = {},
                    result = {};

                if (self.sessionId() && !Col.hasId() || forceReload === true) {
                    where[config.referenceColumn] = self.sessionId();

                    //					if (config.checkDebug('client','session')) {
                    //						Slipstream.debug("loadBySession: where = " + _.stringify(where) + ", refField = "
                    //							+ config.referenceColumn);
                    //					}

                    try {
                        result = Col.loadWhere(where);
                    }
                    catch (e) {
                        if (config.checkDebug('client', 'session'))
                            Slipstream.debug("session::loadBySession - Error " + e.message);
                    }
                    finally {
                        if (config.checkDebug('client', 'session'))
                            Slipstream.debug("session::loadBySession - where = " + _.stringify(where) + ", result = "
                                + _.stringify(result));
                    }
                }
                return result;
            }
        };

        return self;
    };
}());
