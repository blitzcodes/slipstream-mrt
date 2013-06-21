;
(function () {
	//	debug("Slipstream.List");

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
					return _.keys(self.columns);
				}
			});

		if (options.bypassDefaultFields !== true) {
			self.columns = _.extend(self.columns, {
				dateCreated  : Slipstream.Column({
					name        : 'desc',
					label       : 'Project Description',
					type        : InputTypes.hidden,
					placeholder : 'Description',
					default     : new Date().getTime()
				}),
				dateModified : Slipstream.Column({
					name        : 'desc',
					label       : 'Project Description',
					type        : InputTypes.hidden,
					placeholder : 'Description',
					default     : new Date().getTime()
				}),
				dateRemoved  : Slipstream.Column({
					name        : 'desc',
					label       : 'Project Description',
					type        : InputTypes.hidden,
					placeholder : 'Description',
					default     : new Date().getTime()
				})
			});
		}
		//		debug('renderList '+JSON.stringify(self.columns));

		return self;
	};
}());
