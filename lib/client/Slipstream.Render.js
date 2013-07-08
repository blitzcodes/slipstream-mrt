;
(function () {
	Slipstream.Render = function (config, col, router) {
		var self = {
			renderColumns          : function () {
				//				col.renderValues();
				_.each(col.columnNames(), function (value, key, list) { // this referring to one of the filed names in the columnNames array
					col.columns[value].render();
				});

				if (config.debug.render === true && Meteor.isClient)
					Slipstream.debug("render::renderColumns - result = " + JSON.stringify(arr));

				return col.columns;
			},
			renderInputs           : function () {
				var arr = {};

				_.each(col.columnNames(), function (value, key, list) { // this referring to one of the filed names in the columnNames array
					arr[value] = col.columns[value].html;
					if (arr[value] == '')
						arr[value] = col.columns[value].render();
				});

				if (config.debug.render === true && Meteor.isClient)
					Slipstream.debug("render::renderInput - result = " + JSON.stringify(arr));

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
				var result =
					[
					];
				if (Meteor.isClient) {
					router.loadBySession(forceReload);
					result = self.renderColumns();
				}
				return result;
			},
			renderInputsBySession  : function (forceReload) {
				var result =
					[
					];
				if (Meteor.isClient) {
					router.loadBySession(forceReload);
					result = self.renderInputs();
				}
				return result;
			},
			renderValuesBySession  : function (forceReload) {
				var result =
					[
					];
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
