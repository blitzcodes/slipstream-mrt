;
(function () {
	/*
	 ### `Slipstream.ColumnManager(config)`
	 > Type: Class, Returns: Object

	 #### Description
	 > A subclass of the [Slipstream.Collection]{https://github.com/blitzcodes/slipstream-mrt/wiki/Slipstream.Collection).

	 #### Parameters
	 > `config` - JSON
	 > Please refer to [Slipstream.Drift Configuration]{https://github.com/blitzcodes/slipstream-mrt/wiki/Slipstream.Drift#configuration).
	 */
	Slipstream.ColumnManager = function (config) {
		Slipstream.groupCollapsed("Init Columns");

		var columns = {},
			self = _.extend({
				_id : {
					label : 'Id',
					type  : 'hidden'
				}
			}, config.columns);

		if (config.options.requireUserId) {
			_.extend(self, {
				userId : {
					label : 'User Id',
					type  : 'hidden'
				}
			});
		}

		if (config.options.useDefaultDateFields) {
			_.extend(self, {
				dateCreated  : {
					label   : 'Date Created',
					type    : 'hidden',
					default : new Date().getTime()
				},
				dateModified : {
					label   : 'Date Modified',
					type    : 'hidden',
					default : new Date().getTime(),
					process : function (value) {
						return new Date().getTime();
					}
				},
				dateRemoved  : {
					label : 'Date Removed',
					type  : 'hidden'
				}
			});
		}

		//        Slipstream.throwError(601,"colman result = "+ _.stringify(self));

		// Convert column options to full Slipstream Columns now
		_.each(self, function (options, columnName) {
			columns[columnName] = Slipstream.Column(_.extend({name : columnName}, options), config);
		});

		config.debug(
			[
				'client',
				'init',
				'column'
			], 'Collection.columns [] = ', columns);

		Slipstream.groupEnd();

		return columns;
	};
}());
