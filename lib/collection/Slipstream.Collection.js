;
(function () {
	Slipstream.Collection = function (config) {
		var columns = _.extend({
			_id : {
				label : 'Id',
				type  : 'hidden'
			}
		}, config.columns), self = _.extend(Slipstream.CollectionSetup(config), {
			requireUserId        : config.options.requireUserId,
			useDefaultDateFields : config.options.useDefaultDateFields,
			inputs               :
				[
				],
			values               :
				[
				],
			errors               :
				[
				],
			hasId                : function () {
				return columns._id.value;
			},
			loadValues           : function (data) {
				if (config.checkDebug('client', 'collection'))
					Slipstream.debug("collection::loadValues - columns = " + this.columnNames() + ', data ='
						+ _.stringify(data));

				var skipData = _.isUndefined(data);

				_.each(self.columnNames(), function (value, key, list) { // this referring to one of the filed names in the columnNames array
					self.values[value] = columns[value].value = skipData ? columns[value].default : data[value];
				});

				return self.values;
			},
			getInputs            : function () {
				_.each(self.columnNames(), function (value, key, list) { // this referring to one of the filed names in the columnNames array
					columns[value].render();
					self.inputs[value] = columns[value].html;
				});

				if (config.checkDebug('client', 'collection'))
					Slipstream.debug("collection::renderInput - result = " + _.stringify(self.inputs));

				return self.inputs;
			},
			getColumns           : function () {
				_.each(self.columnNames(), function (value, key, list) { // this referring to one of the filed names in the columnNames array
					columns[value].render();
				});

				if (config.checkDebug('client', 'collection'))
					Slipstream.debug("collection::getColumns - result = " + _.stringify(columns));

				return columns;
			},
			loadById             : function (id) {
				this.loadValues(self.findOne({"_id" : id}));
			},
			loadWhere            : function (where) {
				this.loadValues(self.findOne(where));
			},
			loadByTemplate       : function (t) {
				var data = {};
				_.each(self.columnNames(), function (column) {
					var found = t.find("#" + column);
					if (found)
						data[column] = found.value;
				});

				if (config.checkDebug('client', 'collection'))
					Slipstream.debug("template::loadByTemplate - data " + _.stringify(data));

				return data;
			},
			columnNames          : function () {
				var keys = _.keys(columns);
				//				if (config.checkDebug('client','collection'))
				//					Slipstream.debug('collection::columnNames - keys = ' + keys);
				return keys;
			},
			columnPermissions    : function (type) {
				keys =
					[
					];

				if (_.isUndefined(type))
					type = 'insert';

				_.each(columns, function (column, key) {
					if (column.permissions[type])
						keys.push(key);
				});

				return keys;
			},
			process              : function (data) {
				// The data may not contain all fields, but ensure we're only utilizing data that belongs to this col
				var arr = _.pick(data, self.columnNames()),
					userId = data.userId || Meteor.userId();

				//				if (config.checkDebug('client','collection'))
				//					Slipstream.debug("collection::process - arr:before = " + _.stringify(arr));

				// If a global override is set for the process data, run that now
				if (_.isFunction(config.process)) {
					arr = config.process(arr);
				}// Else, process data column by column with their default or extended process functions
				else {
					_.each(arr, function (value, key) { // For each column found in the
						arr[key] = columns[key].process(value);
					});

					if (self.requireUserId)
						arr['userId'] = arr.userId || userId;
				}

				if (_.isFunction(config.postProcess))
					arr = config.postProcess(arr);

				if (config.checkDebug('client', 'collection'))
					Slipstream.debug("collection::process - arr = " + _.stringify(arr));

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

				if (config.checkDebug('client', 'collection'))
					Slipstream.debug("collection::validate - arr = " + _.stringify(arr) + " errors = "
						+ _.stringify(self.errors) + ", result = " + result);

				return result;
			},
			prepareColumns       : function (data) {
				var updateArr = _.omit(data, '_id'),
					updateResults = {};

				if (config.checkDebug('client', 'collection'))
					Slipstream.debug("coolection::prepareColumns - updateArr = " + _.stringify(updateArr));

				_.each(updateArr, function (value, key) {
					if (!_.has(updateResults, columns[key].updateMethod))
						updateResults[columns[key].updateMethod] = {};

					updateResults[columns[key].updateMethod][key] = value;
				});

				if (config.checkDebug('client', 'collection'))
					Slipstream.debug("coolection::prepareColumns - updatedResults = " + _.stringify(updateResults));

				return updateResults;
			}
		});

		if (self.requireUserId === true) {
			_.extend(columns, {
				userId : {
					label : 'User Id',
					type  : 'hidden'
				}
			});
		}

		if (self.useDefaultDateFields === true) {
			_.extend(columns, {
				dateCreated  : {
					label   : 'Date Created',
					type    : 'hidden',
					default : new Date().getTime()
				},
				dateModified : {
					label   : 'Date Modified',
					type    : 'hidden',
					default : new Date().getTime(),
					process : function (value) { return new Date().getTime(); }
				},
				dateRemoved  : {
					label : 'Date Removed',
					type  : 'hidden'
				}
			});
		}

		// Convert column options to full Slipstream Columns now
		_.each(columns, function (options, columnName) {
			columns[columnName] = Slipstream.Column(_.extend({name : columnName}, options), config);
		});

		if (config.checkDebug('client', 'init', 'collection'))
			Slipstream.debug('collection::column configuration = ' + _.stringify(columns));

		if (Meteor.isServer) {
			if (self.requireUserId) {
				Meteor.startup(function () {
					self.allow({
						// Ensure that only the original user can update or delete their entries
						update : ownsDocument,
						remove : ownsDocument
					});
				});
			}

			Meteor.startup(function () {
				self.deny({
					// This check is to help prevent unauthorized or mistaken insertion of fields that aren't
					// in this collection to begin with, to ensure the needed fields are passed and reduce fragmentation
					insert : function (userId, post, fieldNames) {
						return (_.without(fieldNames, self.columnPermissions('insert')).length > 0);
					},

					// This check is to help prevent unauthorized or mistaken updating of fields that either aren't
					// in this collection to begin with, or deemed to be locked in after insertion
					update : function (userId, post, fieldNames) {
						if (config.checkDebug('collection'))
							Slipstream.debug("Updateable fields found " + _.without(fieldNames,
								self.updateableColumns()).length > 0);
						return (_.without(fieldNames, self.columnPermissions('update')).length > 0);
					}
				});
			});
		}

		return self;
	};
}());
