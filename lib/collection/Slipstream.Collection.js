;
(function () {
	Slipstream.Collection = function (config) {
		var columns = _.extend({
			_id : Slipstream.Column({
				name  : '_id',
				label : 'Id',
				type  : 'hidden'
			})
		}, config.columns), self = _.extend(Slipstream.CollectionSetup(config), {
			requireUserId        : config.options.requireUserId,
			useDefaultDateFields : config.options.useDefaultDateFields,
			inputs               :
				[
				],
			values               :
				[
				],
			hasId                : function () {
				return columns._id.value;
			},
			loadValues           : function (data) {
				if (config.debug.collection === true && Meteor.isClient)
					Slipstream.debug("collection::loadValues - columns = " + this.columnNames() + ', data ='
						+ JSON.stringify(data));

				_.each(self.columnNames(), function (value, key, list) { // this referring to one of the filed names in the columnNames array
					columns[value].value = data[value] || columns[value].default;
					self.values[value] = columns[value].value;
				});

				return self.values;
			},
			getInputs         : function () {
				_.each(self.columnNames(), function (value, key, list) { // this referring to one of the filed names in the columnNames array
					columns[value].render();
					self.inputs[value] = columns[value].html;
				});

				if (config.debug.render === true && Meteor.isClient)
					Slipstream.debug("collection::renderInput - result = " + JSON.stringify(self.inputs));

				return self.inputs;
			},
			getColumns        : function () {
				_.each(self.columnNames(), function (value, key, list) { // this referring to one of the filed names in the columnNames array
					columns[value].render();
				});

				if (config.debug.render === true && Meteor.isClient)
					Slipstream.debug("collection::getColumns - result = " + JSON.stringify(columns));

				return columns;
			},
			loadById             : function (id) {
				this.loadValues(self.findOne({"_id" : id}));
			},
			loadWhere            : function (where) {
				this.loadValues(self.findOne(where));
			},
			columnNames          : function () {
				var keys = _.keys(columns);
				if (config.debug.collection === true && Meteor.isClient)
					Slipstream.debug('collection::columnNames - keys = ' + keys);
				return keys;
			},
			updateableColumns    : function () {
				keys =
					[
					];

				if (_.isArray(config.updateableColumns) && config.updateableColumns.length)
					keys = config.updateableColumns;
				else
					keys = self.columnNames();

				return keys;
			},
			getValues            : function () {

			}
		});

		if (self.requireUserId === true) {
			_.extend(columns, {
				userId : Slipstream.Column({
					name  : 'userId',
					label : 'User Id',
					type  : 'hidden'
				})
			});
		}

		if (self.useDefaultDateFields === true) {
			_.extend(columns, {
				dateCreated  : Slipstream.Column({
					name    : 'dateCreated',
					label   : 'Date Created',
					type    : 'hidden',
					default : new Date().getTime()
				}),
				dateModified : Slipstream.Column({
					name    : 'dateModified',
					label   : 'Date Modified',
					type    : 'hidden',
					default : new Date().getTime()
				}),
				dateRemoved  : Slipstream.Column({
					name  : 'dateRemoved',
					label : 'Date Removed',
					type  : 'hidden'
				})
			});
		}

		if (config.debug.collection === true && config.debug.init === true && Meteor.isClient)
			Slipstream.debug('collection::column configuration = ' + JSON.stringify(columns));

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
						return (_.without(fieldNames, self.columnNames()).length > 0);
					},

					// This check is to help prevent unauthorized or mistaken updating of fields that either aren't
					// in this collection to begin with, or deemed to be locked in after insertion
					update : function (userId, post, fieldNames) {
						//						if (config.debug.collection === true)
						Slipstream.debug("Updateable fields found " + _.without(fieldNames,
							self.updateableColumns()).length > 0);
						return (_.without(fieldNames, self.updateableColumns()).length > 0);
					}
				});
			});
		}

		return self;
	};
}());
