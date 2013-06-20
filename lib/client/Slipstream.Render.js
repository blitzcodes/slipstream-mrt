;
(function () {
	//	debug("Slipstream.Template");

	var RenderProto = {
		renderColumns          : function () {
			this.renderValues();

			_.each(this.columnNames(), function (element, index, list) { // this referring to one of the filed names in the columnNames array
				this.columns[element].render();
			});

			//debug("renderColumns is " + JSON.stringify(this.columns));

			return this.columns;
		},
		renderInputs           : function () {
			var arr = {};
			_.each(this.columnNames(), function (element, index, list) { // this referring to one of the filed names in the columnNames array
				arr[element] = this.columns[element].html;
				if (arr[element] == '')
					arr[element] = this.columns[element].render();
			});

			//debug("renderInput is " + JSON.stringify(arr));

			return arr;
		},
		renderValues           : function (forceReload) {
			if (!this.values._id || forceReload === true) {
				var arr = {};
				_.each(this.columnNames(), function (element, index, list) { // this referring to one of the filed names in the columnNames array
					if (element.indexOf('date') != -1)
						arr[element] = new Date(this.columns[element].value).toDateString();
					else
						arr[element] = this.columns[element].value;
				});
				this.values = arr;
			}
			return this.values;
		},
		renderColumnsBySession : function (forceReload) {
			var result = null;
			if (Meteor.isClient) {
				this.loadBySession(forceReload);
				result = this.renderColumns();
			}
			return result;
		},
		renderInputsBySession  : function (forceReload) {
			var result = null;
			if (Meteor.isClient) {
				this.loadBySession(forceReload);
				result = this.renderInputs();
			}
			return result;
		},
		renderValuesBySession  : function (forceReload) {
			var result = null;
			if (Meteor.isClient) {
				this.loadBySession(forceReload);
				result = this.renderValues(forceReload);
			}
			return result;
		}
	};

	Slipstream.Render = function (options) {
		return Object.create(RenderProto);
	};
}());
