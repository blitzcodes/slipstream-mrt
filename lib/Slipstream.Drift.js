;
(function () {
	//	debug("Slipstream.Drift");

	var DriftProto = {
		name           : '',
		referenceField : ''
	};
	Slipstream.Drift = function (options) {
		var self = _.extend(Object.create(DriftProto), _.pick(options, 'name', 'referenceField'));

		self = _.extend(self, Slipstream.List(options));
		self = _.extend(self, Slipstream.Method(options));

		if (Meteor.isClient) {
			self = _.extend(self, Slipstream.Template(options));
			self = _.extend(self, Slipstream.Router(options));
		}

		return self;
	};

//	Slipstream.Drift = function (name, referenceField, columns, bypassDefaultFields) {
//		var list = new Slipstream.List(arguments),
//			method = _.extend(list, new Slipstream.Method(list)),
//			self = _.extend(method, {
//				name           : name,
//				referenceField : referenceField || '_id'
//			});
//
//		// Attributes, methods, and classes that should only ever be accessed via the client
//		if (Meteor.isClient) {
//			self = _.extend(self, {
//				renderColumns          : function () {
//					self.renderValues();
//
//					_.each(self.columnNames(), function (element, index, list) { // this referring to one of the filed names in the columnNames array
//						self.columns[element].render();
//					});
//
//					//debug("renderColumns is " + JSON.stringify(self.columns));
//
//					return this.columns;
//				},
//				renderInputs           : function () {
//					var arr = {};
//					_.each(self.columnNames(), function (element, index, list) { // this referring to one of the filed names in the columnNames array
//						arr[element] = self.columns[element].html;
//						if (arr[element] == '')
//							arr[element] = self.columns[element].render();
//					});
//
//					//debug("renderInput is " + JSON.stringify(arr));
//
//					return arr;
//				},
//				renderValues           : function (forceReload) {
//					if (!this.values._id || forceReload === true) {
//						var arr = {};
//						_.each(this.columnNames(), function (element, index, list) { // this referring to one of the filed names in the columnNames array
//							if (element.indexOf('date') != -1)
//								arr[element] = new Date(self.columns[element].value).toDateString();
//							else
//								arr[element] = self.columns[element].value;
//						});
//						this.values = arr;
//					}
//					return this.values;
//				},
//				renderColumnsBySession : function (forceReload) {
//					var result = null;
//					if (Meteor.isClient) {
//						self.loadBySession(forceReload);
//						result = self.renderColumns();
//					}
//					return result;
//				},
//				renderInputsBySession  : function (forceReload) {
//					var result = null;
//					if (Meteor.isClient) {
//						self.loadBySession(forceReload);
//						result = self.renderInputs();
//					}
//					return result;
//				},
//				renderValuesBySession  : function (forceReload) {
//					var result = null;
//					if (Meteor.isClient) {
//						self.loadBySession(forceReload);
//						result = self.renderValues(forceReload);
//					}
//					return result;
//				},
//				loadBySession : function (forceReload) {
//					if (!list.columns._id.value || forceReload === true) {
//						var where = {};
//						//				Object.defineProperty(where, this.referenceField, {value : this.sessionId()});
//						where[this.referenceField] = this.sessionId();
//						//				var where = [];
//						//				where[this.referenceField] = this.sessionId();
//						//				debug("loadBySession: where = " + JSON.stringify(where) + ", refField = " + this.referenceField
//						//					+ ', sessionId = ' + this.sessionId());
//
//						var result;
//						try {
//							result = this.findOne(where);
//							this.loadValues(result);
//						}
//						catch (e) {
//							//						debug("loadBySession : error encountered: " + e.reason);
//						}
//						finally {
//							//						debug("loadBySession result = " + JSON.stringify(result) + ", typeof findOne = "
//							//							+ ( typeof this.findOne == 'function'));
//						}
//					}
//				}
//			});
//			self = _.extend(self, new Slipstream.Template(name, list));
//			self = _.extend(self, new Slipstream.Router(name, referenceField));
//		}
//
//		return self;
//	};
}());
