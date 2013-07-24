;
(function () {
	var ownsDocument = function (userId, doc) {
		return doc && doc.userId === userId;
	};

	/*
	 ### `Slipstream.defaults`
	 > Type: JSON, Private

	 #### Description
	 > The global default settings defined in the Slipstream, which are used by every new Drift class created.
	 */
	var defaults = {
		referenceColumn : '_id',
		templates       : {},
		methods         : {},
		allow           : {
			// Ensure that only the original user can update or delete their entries
			update : ownsDocument,
			remove : ownsDocument
		},
		deny            : {},
		routes          :
			[
			],
		process         : null,
		postProcess     : null,
		validate        : null,
		permissions     : {
			insert : true,
			update : true,
			delete : true,
			list   : true,
			view   : true
		},
		options         : {
			requireUserId        : true,
			routesPluralized     : true,
			useDefaultDateFields : true,
			scaffolding          : true
		},
		debugging       : {
			enabled    : false,
			init       : true,
			collection : true,
			column     : true,
			method     : true,
			router     : true,
			session    : true,
			template   : true
		},
		validation      : {
			required : /^.+$/i,
			email    : /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
			phone    : function () {
				return defaults.validation.tel;
			},
			tel      : /^\(?(\d{1})?\)?[-\. ]?(\d{3})\)?[-\. ]?(\d{3})[-\. ]?(\d{4})(\s+e?x?t?[\d]*)?$/,
			postal   : /^([0-9]{5})|(\s*[a-ceghj-npr-tvxy]\d[a-ceghj-npr-tv-z](\s)?\d[a-ceghj-npr-tv-z]\d\s*)$/i
		},
		renderAs        : {
			textarea : function (column) {
				//				Slipstream.debug.log("renderAs::textarea - column"+ _.stringify(column));
				return _.sprintf("<textarea id='%1$s' placeholder='%2$s' class='%3$s %4$s'>%5$s</textarea>",
					column.name, column.placeholder, column.type, column.classes, column.value());
			},
			default  : function (column) {
				//				Slipstream.debug.log("renderAs::textarea - column"+ _.stringify(column));
				return _.sprintf("<input id='%1$s' name='%1$s' placeholder='%2$s' type='%3$s' class='%3$s %4$s' value='%5$s'/>",
					column.name, column.placeholder, column.type, column.classes, column.value());
			}
		},
		validateAs      : {
			select  : function (column) {
				return !(_.isUndefined(column.value) || column.value
					== $(column.jqId).find('option:first').val());
			},
			default : function (column) {
				return !(_.isUndefined(column.value) || column.value === column.placeholder);
			}
		}
	};

	/*
	 ### `Slipstream.defaults(override)`
	 > Type: Function, Returns: JSON

	 #### Description
	 > This function is called by every new Drift that is created, by pulling the set of global default settings currently defined in the Slipstream.

	 > Later in code you wish to compare a Drift objects config to the defaults for some reason, you'd be able to call this method to accomplish this.

	 #### Parameters
	 `override` - JSON
	 > This method is also accepts a single JSON parameter. Setting this value will in part override the original global Slipstream defaults, by extending over top of the original with any new settings you wish to apply. This allows the flexibility for you to ensure all Drifts you create function by default the way you desire.
	 > In order for this to be most effective, it is highly recommend this is ran in a js file somewhere like `/lib` to ensure it precedes any and all Drift calls. It is unlikely that you would need to create a series of Drifts, then alter the defaults and override any objects created after that point, however this is entirely possible as well setting the override at a later point in execution.
	 */
	Slipstream.defaults = function (override) {
		if (_.isObject(override)) // Check to see if the parameter was set
			_.extend(defaults, override || {}); // Now let's extend the original object, to update relevant pieces without distorting the remaining parameters

		return defaults;
	};
}());
