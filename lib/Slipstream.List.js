;
(function () {
	//	debug("Slipstream.List");

	Slipstream.List = function (name, columns, bypassDefaultFields) {
		var col = new Meteor.Collection(name),
			self = _.extend(col, {
				/***************************
				 COLLECTION Attributes & Methods
				 ****************************/
				columns                : _.extend(columns, {
					_id : new Slipstream.Column({
						name        : '_id',
						label       : 'Id',
						type        : InputTypes.hidden,
						placeholder : ''
					})
				}),
				values                 :
					[
					],
				renderColumns          : function () {
					self.renderValues();

					_.each(self.columnNames(), function (element, index, list) { // this referring to one of the filed names in the columnNames array
						self.columns[element].render();
					});

					debug("renderColumns is " + JSON.stringify(self.columns));

					return this.columns;
				},
				renderInputs           : function () {
					var arr = {};
					_.each(self.columnNames(), function (element, index, list) { // this referring to one of the filed names in the columnNames array
						arr[element] = self.columns[element].html;
						if (arr[element] == '')
							arr[element] = self.columns[element].render();
					});

					debug("renderInput is " + JSON.stringify(arr));

					return arr;
				},
				renderValues           : function (forceReload) {
					if (!this.values._id || forceReload === true) {
						var arr = {};
						_.each(this.columnNames(), function (element, index, list) { // this referring to one of the filed names in the columnNames array
							arr[element] = self.columns[element].value;
						});
						this.values = arr;
					}
					return this.values;
				},
				loadValues             : function (data) {
					if (data) {
						//					debug("loadValues columns = " + this.columnNames() + ', data =' + JSON.stringify(data));
						_.each(this.columnNames(), function (element, index, list) { // this referring to one of the filed names in the columnNames array
							self.columns[element].value = data[element] || self.columns[element].default;
						});
					}
					else {
						//					debug("loadValues: data = " + JSON.stringify(data));
						throw new Meteor.Error(601, "Cannot load null data");
					}
				},
				loadValuesFromTemplate : function (t) {
					var data = {};
					_.each(self.columns, function (element, index, list) {
						var found = t.find("#" + element.name);
						if (found)
							data[element.name] = found.value;
						//						else
						//							data[element.name] = element.default;
					});
					return data;
				},
				loadById               : function (id) {
					this.loadValues(this.findOne({"_id" : id}));
				},
				columnNames            : function () {
					return _.keys(this.columns);
				}
			});

		// If we wish to bypass these columns, they won't be added, but it mist be explicitly set to true, else they're added
		if (bypassDefaultFields !== true) {
			self.columns = _.extend(self.columns, {
				dateCreated  : new Slipstream.Column({
					name        : 'desc',
					label       : 'Project Description',
					type        : InputTypes.hidden,
					placeholder : 'Description',
					default     : new Date().getTime()
				}),
				dateModified : new Slipstream.Column({
					name        : 'desc',
					label       : 'Project Description',
					type        : InputTypes.hidden,
					placeholder : 'Description',
					default     : new Date().getTime()
				}),
				dateRemoved  : new Slipstream.Column({
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
}());
