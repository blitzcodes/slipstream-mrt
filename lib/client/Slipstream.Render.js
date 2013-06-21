;
(function () {
	//	debug("Slipstream.Template");

	Slipstream.Render = function (col, router, options) {
		var self = {
			renderColumns          : function () {
				col.renderValues();

				_.each(col.columnNames(), function (element, index, list) { // this referring to one of the filed names in the columnNames array
					col.columns[element].render();
				});

				//debug("renderColumns is " + JSON.stringify(list.columns));

				return col.columns;
			},
			renderInputs           : function () {
				var arr = {};

				_.each(col.columnNames(), function (element, index, list) { // this referring to one of the filed names in the columnNames array

					arr[element] = col.columns[element].html;
					if (arr[element] == '')
						arr[element] = col.columns[element].render();
				});

				//debug("renderInput is " + JSON.stringify(arr));

				return arr;
			},
			renderValues           : function (forceReload) {
				if (!col.values._id || forceReload === true) {
					var arr = {};
					_.each(col.columnNames(), function (element, index, list) { // this referring to one of the filed names in the columnNames array
						if (element.indexOf('date') != -1)
							arr[element] = new Date(col.columns[element].value).toDateString();
						else
							arr[element] = col.columns[element].value;
					});
					col.values = arr;
				}
				return col.values;
			},
			renderColumnsBySession : function (forceReload) {
				var result = null;
				if (Meteor.isClient) {
					router.loadBySession(forceReload);
					result = self.renderColumns();
				}
				return result;
			},
			renderInputsBySession  : function (forceReload) {
				var result = null;
				if (Meteor.isClient) {
					router.loadBySession(forceReload);
					result = self.renderInputs();
				}
				return result;
			},
			renderValuesBySession  : function (forceReload) {
				var result = null;
				if (Meteor.isClient) {
					router.loadBySession(forceReload);
					result = self.renderValues(forceReload);
				}
				return result;
			}
		};

		return self;
	};
}());
