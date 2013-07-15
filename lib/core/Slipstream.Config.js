;
(function () {
    /*
     ### `Slipstream.Config(config)`
     > Type: Class, Returns: Object

     #### Description
     >

     #### Parameters
     > `config` - JSON
     > The definition and configuration specific to the new Drift object that's being creating.  See [Slipstream.Drift Configuration]{https://github.com/blitzcodes/slipstream-mrt/wiki/Slipstream.Drift#configuration) for full details on the breadth of options to choose from when setting up a new Drift.
     */
    Slipstream.Config = function (config) {
        var defaults = Slipstream.defaults(),
            self = _.defaults({
                name: _.trim(config.name.toLowerCase()),
                referenceColumn: _.trim(config.referenceColumn.toLowerCase()),
                sessionReference: 'current' + _.capitalize(config.name) + 'Id',

                columns: config.columns,

                permissions: _.defaults(config.permissions || {}, defaults.permissions),
                options: _.defaults(config.options || {}, defaults.options),
                validation: _.defaults(config.validation || {}, defaults.validation),

                debug: config.debug !== false ? _.defaults(config.debug || {}, defaults.debug) : {},

                checkDebug: function () {
                    var checks = true,
                        debug = '';

                    if (config.debug.enabled) {

                        debug += "params here is " + _.stringify(arguments);
                        debug += "\nconfig.debug here is " + _.stringify(config.debug);

                        _.each(arguments, function (key) {
                            if (checks && key == 'client')
                                checks = checks && Meteor.isClient;
                            else if (checks && key == 'server')
                                checks = checks && Meteor.isServer;
                            else
                                checks = checks && config.debug[key];
                        });

                        //			Slipstream.debug(debug + "\ncheck here is " + checks);
                    }
                    return checks;
                }
            }, defaults);

        return self;
    };
}());
