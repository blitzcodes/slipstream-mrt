;
(function () {
	//	debug("Slipstream.List");

	var ListProto = {
		bypassDefaultFields    : false,
		columns                : {
			_id : Slipstream.Column({
				name        : '_id',
				label       : 'Id',
				type        : InputTypes.hidden,
				placeholder : ''
			})
		},
		values                 :
			[
			],
		loadValues             : function (data) {
			if (data) {
				//					debug("loadValues columns = " + this.columnNames() + ', data =' + JSON.stringify(data));
				_.each(this.columnNames(), function (element, index, list) { // this referring to one of the filed names in the columnNames array
					this.columns[element].value = data[element] || this.columns[element].default;
				});
			}
			else {
				//					debug("loadValues: data = " + JSON.stringify(data));
				throw new Meteor.Error(601, "Cannot load null data");
			}
		},
//		loadValuesFromTemplate : function (t) {
//			var data = {};
//			_.each(this.columns, function (element, index, list) {
//				var found = t.find("#" + element.name);
//				if (found)
//					data[element.name] = found.value;
//				//						else
//				//							data[element.name] = element.default;
//			});
//			return data;
//		},
		loadById               : function (id) {
			this.loadValues(this.findOne({"_id" : id}));
		},
		columnNames            : function () {
			return _.keys(this.columns);
		}
	};

	Slipstream.List = function (options) {
		var self = _.extned(Object.create(ListProto), new Meteor.Collection(name));

		if (options.columns)
			self.columns = _.extend(self.columns, options.columns);

		if (self.bypassDefaultFields !== true) {
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

		return self;
	};
	//
	//	Slipstream.List = function (name, referenceField, columns, bypassDefaultFields) {
	//		if (name == 'errors')
	//			name = null;
	//
	//		var col = new Meteor.Collection(name),
	//			self = _.extend(col, {
	//				/***************************
	//				 COLLECTION Attributes & Methods
	//				 ****************************/
	//				columns                : _.extend(columns, {
	//					_id : new Slipstream.Column({
	//						name        : '_id',
	//						label       : 'Id',
	//						type        : InputTypes.hidden,
	//						placeholder : ''
	//					})
	//				}),
	//				values                 :
	//					[
	//					],
	//				loadValues             : function (data) {
	//					if (data) {
	//						//					debug("loadValues columns = " + this.columnNames() + ', data =' + JSON.stringify(data));
	//						_.each(this.columnNames(), function (element, index, list) { // this referring to one of the filed names in the columnNames array
	//							self.columns[element].value = data[element] || self.columns[element].default;
	//						});
	//					}
	//					else {
	//						//					debug("loadValues: data = " + JSON.stringify(data));
	//						throw new Meteor.Error(601, "Cannot load null data");
	//					}
	//				},
	//				loadValuesFromTemplate : function (t) {
	//					var data = {};
	//					_.each(self.columns, function (element, index, list) {
	//						var found = t.find("#" + element.name);
	//						if (found)
	//							data[element.name] = found.value;
	//						//						else
	//						//							data[element.name] = element.default;
	//					});
	//					return data;
	//				},
	//				loadById               : function (id) {
	//					this.loadValues(this.findOne({"_id" : id}));
	//				},
	//				columnNames            : function () {
	//					return _.keys(this.columns);
	//				}
	//			});
	//
	//		// If we wish to bypass these columns, they won't be added, but it mist be explicitly set to true, else they're added
	//		if (bypassDefaultFields !== true) {
	//			self.columns = _.extend(self.columns, {
	//				dateCreated  : new Slipstream.Column({
	//					name        : 'desc',
	//					label       : 'Project Description',
	//					type        : InputTypes.hidden,
	//					placeholder : 'Description',
	//					default     : new Date().getTime()
	//				}),
	//				dateModified : new Slipstream.Column({
	//					name        : 'desc',
	//					label       : 'Project Description',
	//					type        : InputTypes.hidden,
	//					placeholder : 'Description',
	//					default     : new Date().getTime()
	//				}),
	//				dateRemoved  : new Slipstream.Column({
	//					name        : 'desc',
	//					label       : 'Project Description',
	//					type        : InputTypes.hidden,
	//					placeholder : 'Description',
	//					default     : new Date().getTime()
	//				})
	//			});
	//		}
	//
	//		if (Meteor.client) {
	//
	//		}
	//
	//		return self;
	//	};
}());
