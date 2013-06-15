;
(function () {
	//	debug("Slipstream.Drift");

	Slipstream.Drift = function (name, referenceField, columns, bypassDefaultFields) {
		var list = new Slipstream.List(name, columns, bypassDefaultFields),
			method = _.extend(list, new Slipstream.Method(list)),
			self = _.extend(method, {
				name           : name,
				referenceField : referenceField || '_id'
			});

		if (Meteor.isClient) {
			self = _.extend(method, {
				/***************************
				 COLLECTION Attributes & Methods
				 ****************************/
				//			columns       : function () {return list.columns; },
				//			columnNames   : function () { return list.columnNames(); },
				//			values        : function () {return list.values; },
				//			renderColumns : list.renderColumns,
				//			renderInputs  : list.renderInputs,
				//			renderValues  : list.renderValues,
				//			loadValues    : list.loadValues,
				//			loadById      : list.loadById,

				renderColumnsBySession : function (forceReload) {
					var result = null;
					if (Meteor.isClient) {
						self.loadBySession(forceReload);
						result = self.renderColumns();
					}
					return result;
				},
				renderInputsBySession  : function (forceReload) {
					var result = null;
					if (Meteor.isClient) {
						self.loadBySession(forceReload);
						result = self.renderInputs();
					}
					return result;
				},
				renderValuesBySession  : function (forceReload) {
					var result = null;
					if (Meteor.isClient) {
						self.loadBySession(forceReload);
						result = self.renderValues(forceReload);
					}
					return result;
				},
				loadBySession          : function (forceReload) {
					if (!this.columns._id.value || forceReload === true) {
						var where = {};
						//				Object.defineProperty(where, this.referenceField, {value : this.sessionId()});
						where[this.referenceField] = this.sessionId();
						//				var where = [];
						//				where[this.referenceField] = this.sessionId();
						//				debug("loadBySession: where = " + JSON.stringify(where) + ", refField = " + this.referenceField
						//					+ ', sessionId = ' + this.sessionId());

						var result;
						try {
							result = this.findOne(where);
							this.loadValues(result);
						}
						catch (e) {
							//						debug("loadBySession : error encountered: " + e.reason);
						}
						finally {
							//						debug("loadBySession result = " + JSON.stringify(result) + ", typeof findOne = "
							//							+ ( typeof this.findOne == 'function'));
						}
					}
				}
			});
			self = _.extend(self, new Slipstream.Template(name, list));
			self = _.extend(self, new Slipstream.Router(name, referenceField, list));
		}

		return self;
	};
}());
