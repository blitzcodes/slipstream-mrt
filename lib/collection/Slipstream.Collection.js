;
(function () {
	/*
	 ### `Slipstream.Collection(config)`
	 > Type: Class, Returns: Object

	 #### Description
	 > A subclass of the [Slipstream.Drift]{https://github.com/blitzcodes/slipstream-mrt/wiki/Slipstream.Drift). This class directly extends/inherits from the Meteor.Collection class itself, which a slue of customer functionality built on top to support the Slipstream, after it has been pre-configured by the [Slipstream.CollectionSetup]{https://github.com/blitzcodes/slipstream-mrt/wiki/Slipstream.CollectionSetup) to properly set up the necessary pub/subs.

	 #### Parameters
	 > `config` - JSON
	 > Please refer to [Slipstream.Drift Configuration]{https://github.com/blitzcodes/slipstream-mrt/wiki/Slipstream.Drift#configuration).
	 */
	Slipstream.Collection = function (config) {
		var columns = Slipstream.ColumnManager(config),
			col = Slipstream.CollectionSetup(config, columns),
		// To allow this method to be private, yet still access the resulting object, accept it as the first parameter,
		// followed by the resulting Mongo cursor to populate the columns
			loadValues = function (self, data) {
				self.reset();

				// We don't want an undefined object being evaluated below, so ensure that data
				data = data || {};

				_.each(self.columnNames(), function (key) { // this referring to one of the filed columnNames in the columnNames array
					self.values[key] = columns[key].value(data[key]);
				});

				self.values['refId'] = self.getRefId();

				config.debug(_.sprintf("collection::loadValues - columns = %s, resulting values = %s",
					self.columnNames(), _.stringify(self.values)), 'client', 'collection');

				return self.values;
			},
			self = _.extend(col, {
				columns              : columns,
				inputs               : {},
				values               : {},
				errors               : {},
				requireUserId        : config.options.requireUserId,
				useDefaultDateFields : config.options.useDefaultDateFields,
				hasId                : function () {
					return !!columns._id.value; // Ensure the return is set to a boolean
				},
				reset                : function () {
					self.inputs = {};
					self.values = {};
					self.errors = {};
					_.each(self.columnNames(), function (key) {
						columns[key].value('');
					});
				},
				getRefId             : function () {
					return columns[config.referenceColumn].value();
				},
				columnNames          : function () {
					return _.keys(columns);
				},
				loadById             : function (id) {
					return loadValues(self, col.findOne({"_id" : id}));
				},
				loadWhere            : function (where) {
					return loadValues(self, col.findOne(where));
				},
				loadByTemplate       : function (t) {
					var data = {};

					_.each(self.columnNames(), function (key) {
						self.values[key] = columns[key].setValueFromTemplate(t);
					});

					config.debug("template::loadByTemplate - data " + _.stringify(data), 'client', 'collection');

					return self.values;
				},
				getInputs            : function () {
					_.each(self.columnNames(), function (key) { // this referring to one of the filed columnNames in the columnNames array
						self.inputs[key] = columns[key].render();
					});

					config.debug("collection::renderInput - result = " + _.stringify(self.inputs),
						'client', 'collection');

					return self.inputs;
				},
				getColumns           : function () {
					_.each(self.columnNames(), function (key) { // this referring to one of the filed columnNames in the columnNames array
						columns[key].render();
					});

					config.debug("collection::getColumns - result = " + _.stringify(columns), 'client', 'collection');

					return columns;
				},
				process              : function (data) {
					// The data may not contain all fields, but ensure we're only utilizing data that belongs to this col
					var arr = _.pick(data, self.columnNames());

					config.debug("collection::process - arr:before = " + _.stringify(arr), 'client', 'collection');

					// If a global override is set for the process data, run that now
					if (_.isFunction(config.process)) {
						arr = config.process(arr);
					}// Else, process data column by column with their default or extended process functions
					else {
						_.each(arr, function (value, key) { // For each column found in the
							arr[key] = columns[key].process(value);
						});

						if (self.requireUserId) {
							arr['userId'] = arr.userId || data.userId || Meteor.userId();
						}
					}

					if (_.isFunction(config.postProcess))
						arr = config.postProcess(arr);

					config.debug("collection::process - arr = " + _.stringify(arr), 'client', 'method');

					return arr;
				},
				validate             : function (data) {
					// The data may not contain all fields, but ensure we're only utilizing data that belongs to this col
					var arr = _.pick(data, self.columnNames()),
						result = true;

					self.errors =
						[
						];
					clearInterval(Slipstream.log.logLooper);
					Slipstream.log.fadeOutLastLog(200);

					if (_.isFunction(config.validate)) // If a global override is set for the process data, run that now
						result = config.validate(arr);
					else { // Else, process data column by column with their default or extended process functions
						_.each(arr, function (value, key) { // For each column found in the
							if (!columns[key].validate(value))
								self.errors.push("Please enter a valid " + columns[key].label);
							//							results[key] = column[key].error;
						});
						result = self.errors.length == 0;
					}

					config.debug(_.sprintf("collection::validate - arr = %s, errors = %s, result = %s",
						_.stringify(arr), _.stringify(self.errors), result),
						'client', 'collection');

					return result;
				}
			});

		return self;
	};
}());
