;
(function () {
	var ValidationPatterns = {
		required : /^.+$/i,
		email    : /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
		phone    : /^\(?(\d{1})?\)?[-\. ]?(\d{3})\)?[-\. ]?(\d{3})[-\. ]?(\d{4})(\s+e?x?t?[\d]*)?$/,
		tel      : /^\(?(\d{1})?\)?[-\. ]?(\d{3})\)?[-\. ]?(\d{3})[-\. ]?(\d{4})(\s+e?x?t?[\d]*)?$/,
		postal   : /^([0-9]{5})|(\s*[a-ceghj-npr-tvxy]\d[a-ceghj-npr-tv-z](\s)?\d[a-ceghj-npr-tv-z]\d\s*)$/i
	};

	Slipstream.Column = function (options, config) {
		if (!_.isObject(options) || !_.isString(options.name))
			return Slipstream.throwError(601, "Unable to define Column, no options or column name supplied.");

		_.defaults(options, {
			type       : 'text',
			default    : '',
			attrs      : '',
			value      : '',
			html       : '',
			debug      : false,
			validation :
				[
				],
			updateMethod : "$set"
		});

		options.permissions = options.permissions || {};
		_.defaults(options.permissions, {
			insert : true,
			update : true
		});

		var columnName = options.name,
			self = {
				name        : columnName,
				jqId        : "#" + columnName,
				label       : options.label || columnName,
				type        : options.type,
				placeholder : options.placeholder || options.label || columnName,
				default     : options.default || '',

				attrs      : options.attrs,
				html       : options.html,
				debug      : options.debug,
				validation : options.validation,

				updateMethod : options.updateMethod,

				permissions : options.permissions,

				process  : function (value) {
					if (_.isFunction(options.process))
						self.value = options.process(value);
					else
						self.value = value || self.value || self.default;

					if (config.checkDebug('client', 'column'))
						Slipstream.debug("column::process - column = "+columnName+", value = " + value + ", customProcess = "
							+ _.isFunction(options.process));

					return self.value;
				},
				render   : function (classes) {
					// We need to allow for some falsey values, in the event options/columns are blank or unset
					var value = self.value === false || self.value === 0 || self.value ? self.value : self.default,
						customClasses = classes || '',
						renderAs = {
							"textarea" : function () {
								return "<textarea id='" + self.name + "' placeholder='" + self.placeholder + "' class='"
									+ self.type + ' ' + customClasses + "'>" + value + "</textarea>";
							},
							"default"  : function () {
								return "<input id='" + self.name + "' type='" + self.type + "' placeholder='"
									+ self.placeholder + "' value='" + value + "' class='" + self.type + ' '
									+ customClasses
									+ "' />";
							}

						};

					self.html = checkType(renderAs);

					return self.html;
				},
				validate : function (value) {
					var valid = true,
						validateAs = {
							"select"  : function () {
								return !(_.isUndefined(self.value) || self.value
									== $(self.jqId).find('option:first').val());
							},
							"default" : function () {
								return !(_.isUndefined(self.value) || self.value === self.placeholder);
							}
						};

					self.value = value;

					var debug = "column::valid - name " + self.name +
						", validateArr = " + _.stringify(self.validation);

					if (valid)
						valid = checkType(validateAs);

					_.each(self.validation, function (value, key, list) {
						debug += ", regex " + value;
						valid = valid && self.value.search(ValidationPatterns[value]) !== -1; // checking to see if this is true/matches
					});

					if (config.checkDebug('client', 'column'))
						Slipstream.debug(debug + ", valid = " + valid);

					return valid;
				}
			};

		var checkType = function checkType(func) {
			var type = self.type;

			if (type === 'editor')
				type = 'textarea';

			else if (typeof func[type] !== 'function')
				type = 'default';

			if (self.debug === true)
				Slipstream.debug("column::checkType - Type for " + type + ", typeof " + typeof renderAs[type]);

			return func[type]();
		};

		return self;
	};
}());
