;
(function () {
	//	debug("Slipstream.Template");

	Slipstream.Render = function (config, col, router) {
		var self = {
			renderColumns          : function () {
//				col.renderValues();

				_.each(col.columnNames(), function (value, key, list) { // this referring to one of the filed names in the columnNames array
					col.columns[value].render();
				});

				//debug("renderColumns is " + JSON.stringify(col.columns));

				return col.columns;
			},
			renderInputs           : function () {
				var arr = {};

				_.each(col.columnNames(), function (value, key, list) { // this referring to one of the filed names in the columnNames array

					arr[value] = col.columns[value].html;
					if (arr[value] == '')
						arr[value] = col.columns[value].render();

					//debug("this value = "+value+", "+arr[value]);
				});

				//debug("renderInput is " + JSON.stringify(arr));

				return arr;
			},
			renderValues           : function (forceReload) {
				if (!col.values._id || forceReload === true) {
					var arr = {};
					_.each(col.columnNames(), function (value, key, list) { // this referring to one of the filed names in the columnNames array
						if (value.indexOf('date') != -1)
							arr[value] = new Date(col.columns[value].value).toDateString();
						else
							arr[value] = col.columns[value].value;
					});
					col.values = arr;
				}
				return col.values;
			},
			renderColumnsBySession : function (forceReload) {
				var result = [];
				if (Meteor.isClient) {
					router.loadBySession(forceReload);
					result = self.renderColumns();
				}
				return result;
			},
			renderInputsBySession  : function (forceReload) {
				var result = [];
				if (Meteor.isClient) {
					router.loadBySession(forceReload);
					result = self.renderInputs();
				}
				return result;
			},
			renderValuesBySession  : function (forceReload) {
				var result = [];
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
