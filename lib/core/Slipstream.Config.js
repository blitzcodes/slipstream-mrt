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
				name             : _.trim(config.name.toLowerCase()),
				referenceColumn  : config.referenceColumn ?
					_.trim(config.referenceColumn.toLowerCase()) : defaults.referenceColumn,
				sessionReference : config.sessionReference ?
					config.sessionReference : 'current' + _.capitalize(config.name.toLowerCase()) + 'Id',

				columns   : config.columns,

				/* **************
				 These objects are set to pull their individual defaults, since if they already exist, the main
				 _.default wrap above on the self var will bypassed them if they're not explicitly called.

				 While most of these objects in the Slipstream defaults are set to {}/[] already, thus making these
				 calls seem redundant, they are called in order to ensure a dev who enforce new global defaults within
				 their application, that configs of new Drifts will automatically pull their chosen definitions
				 verse store the blank objects & arrays.
				 */
				templates : _.defaults(config.templates || {}, defaults.templates),
				routes    : _.defaults(config.routes ||
					[
					], defaults.routes),

				process     : _.defaults(config.process || {}, defaults.process),
				postProcess : _.defaults(config.postProcess || {}, defaults.postProcess),

				renderAs   : _.defaults(config.renderAs || {}, defaults.renderAs),
				validateAs : _.defaults(config.validateAs || {}, defaults.validateAs),

				permissions : _.defaults(config.permissions || {}, defaults.permissions),
				options     : _.defaults(config.options || {}, defaults.options),
				/* ************** */

				debugging : config.debugging !== false ? _.defaults(config.debugging || {}, defaults.debugging) : {},

				debug : function () {
					var checks = true,
						debug = '';

					if (config.debugging.enabled) {

						if (arguments.length > 1) {
							var args = Array.prototype.slice.call(arguments, 1);
							debug += "params here is " + _.stringify(args);
							debug += "\nconfig.debugging here is " + _.stringify(config.debugging);

							_.each(args, function (key) {
								if (checks && key == 'client')
									checks = checks && Meteor.isClient;
								else if (checks && key == 'server')
									checks = checks && Meteor.isServer;
								else
									checks = checks && config.debugging[key];
							});

							if (checks)
								Slipstream.debug(arguments[0]);
						}
						else
							Slipstream.debug(arguments[0]);
					}

					//					Slipstream.debug(debug);

					return checks;
				}
			}, defaults);

		return self;
	};
}());
