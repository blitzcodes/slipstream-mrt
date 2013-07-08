;
(function () {
	Slipstream.Collection = function (config) {
		var self = _.extend(Slipstream.CollectionSetup(config), {
			bypassDefaultFields : config.bypassDefaultFields || false,
			columns             : _.extend({
				_id : Slipstream.Column({
					name  : '_id',
					label : 'Id',
					type  : 'hidden'
				})
			}, config.columns),
			values              :
				[
				],
			loadValues          : function (data) {
				if (config.debug.collection === true && Meteor.isClient)
					Meteor._debug("collection::loadValues - columns = " + this.columnNames() + ', data ='
						+ JSON.stringify(data));

				if (data) {
					_.each(self.columnNames(), function (value, key, list) { // this referring to one of the filed names in the columnNames array
						self.columns[value].value = data[value] || self.columns[value].default;
					});
				}
				else {
					throw new Meteor.Error(601, "Cannot load null data");
				}
			},
			loadById            : function (id) {
				this.loadValues(self.findOne({"_id" : id}));
			},
			columnNames         : function () {
				var keys = _.keys(self.columns);
				if (config.debug.collection === true && Meteor.isClient)
					Meteor._debug('collection::columnNames - keys = ' + keys);
				return keys;
			},
			updateableColumns   : function () {
				keys =
					[
					];
				if (config.updateableColumns)
					keys = config.updateableColumns;
				else
					keys = self.columnNames();

				return keys;
			}
		});

		if (config.requireUserId === true) {
			self.columns = _.extend(self.columns, {
				userId : Slipstream.Column({
					name  : 'userId',
					label : 'User Id',
					type  : 'hidden'
				})
			});
		}

		if (config.bypassDefaultFields !== true) {
			self.columns = _.extend(self.columns, {
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
			Meteor._debug('collection::column configuration = ' + JSON.stringify(self.columns));

		if (Meteor.isServer) {
			if (config.requireUserId) {
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
					// in this collection to begin with
					insert : function (userId, post, fieldNames) {
						return (_.without(fieldNames, self.columnNames()).length > 0);
					},

					// This check is to help prevent unauthorized or mistaken updating of fields that either aren't
					// in this collection to begin with, or deemed to be locked in after insertion
					update : function (userId, post, fieldNames) {
						//						if (config.debug.collection === true)
						Meteor._debug("Updateable fields found " + _.without(fieldNames,
							self.updateableColumns()).length > 0);
						return (_.without(fieldNames, self.updateableColumns()).length > 0);
					}
				});
			});
		}

		return self;
	};
}());
