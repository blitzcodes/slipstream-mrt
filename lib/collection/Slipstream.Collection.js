;
(function () {
	Slipstream.Collection = function (options) {
		var col = new Meteor.Collection(options.name),
			self = _.extend(col, {
				bypassDefaultFields : false,
				columns             : _.extend({
					_id : Slipstream.Column({
						name        : '_id',
						label       : 'Id',
						type        : InputTypes.hidden,
						placeholder : ''
					})
				}, options.columns),
				values              :
					[
					],
				loadValues          : function (data) {
					if (data) {
						//					debug("loadValues columns = " + this.columnNames() + ', data =' + JSON.stringify(data));
						_.each(self.columnNames(), function (element, index, list) { // this referring to one of the filed names in the columnNames array
							self.columns[element].value = data[element] || self.columns[element].default;
						});
					}
					else {
						//					debug("loadValues: data = " + JSON.stringify(data));
						throw new Meteor.Error(601, "Cannot load null data");
					}
				},
				loadById            : function (id) {
					this.loadValues(self.findOne({"_id" : id}));
				},
				columnNames         : function () {
					var keys = _.keys(self.columns);
					//					debug('keys = '+keys);
					return keys;
				},
				updateableColumns   : function () {
					keys =
						[
						];
					if (options.updateableColumns)
						keys = options.updateableColumns;
					else
						keys = self.columnNames();

					return keys;
				}
			});

		if (options.requireUserId === true) {
			self.columns = _.extend(self.columns, {
				userId : Slipstream.Column({
					name  : 'userId',
					label : 'User Id',
					type  : InputTypes.hidden
				})
			});
		}

		if (options.bypassDefaultFields !== true) {
			self.columns = _.extend(self.columns, {
				dateCreated  : Slipstream.Column({
					name    : 'dateCreated',
					label   : 'Date Created',
					type    : InputTypes.hidden,
					default : new Date().getTime()
				}),
				dateModified : Slipstream.Column({
					name        : 'dateModified',
					label       : 'Date Modified',
					type        : InputTypes.hidden,
					default     : new Date().getTime()
				}),
				dateRemoved  : Slipstream.Column({
					name        : 'dateRemoved',
					label       : 'Date Removed',
					type        : InputTypes.hidden
				})
			});
		}
		//		debug('renderList '+JSON.stringify(self.columns));

		if (Meteor.isServer) {
			if (options.requireUserId) {
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
						return (_.without(fieldNames, self.updateableColumns()).length > 0);
					}
				});
			});
		}

		return self;
	};
}());
