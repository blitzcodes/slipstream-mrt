;
(function () {
	var ValidationPatterns = {
		required : /^.+$/i,
		email    : /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/,
		phone    : /^\(?(\d{1})?\)?[-\. ]?(\d{3})\)?[-\. ]?(\d{3})[-\. ]?(\d{4})(\s+e?x?t?[\d]*)?$/,
		tel      : /^\(?(\d{1})?\)?[-\. ]?(\d{3})\)?[-\. ]?(\d{3})[-\. ]?(\d{4})(\s+e?x?t?[\d]*)?$/,
		postal   : /^([0-9]{5})|(\s*[a-ceghj-npr-tvxy]\d[a-ceghj-npr-tv-z](\s)?\d[a-ceghj-npr-tv-z]\d\s*)$/i
	};

	Slipstream.Column = function (options) {
		if (!_.isObject(options) || !_.isString(options.name))
			return Slpistream.throwError(601, "Unable to define Column, no options or column name supplied.");

		_.defaults(options, {
			type       : 'text',
			default    : '',
			attrs      : '',
			value      : '',
			html       : '',
			debug      : false,
			validation :
				[
				]

		});

		config.permissions = config.permissions || {};
		_.defaults(options.permissions, {
			insert : true,
			update : true
		});

		var self = {
			name        : options.name,
			jqId        : "#" + options.name,
			label       : options.label || options.name,
			type        : options.type,
			placeholder : options.placeholder || options.label || options.name,
			default     : options.default || '',
			attrs       : options.attrs,
			value       : '',
			html        : '',
			debug       : false,
			validation  :
				[
				],
			permissions : options.permissions,
			process     : function (value) {
				if (_.isFunction(options.process))
					return options.process(value);

				self.value = value || self.default;

				return self.value;
			},
			render      : function (classes) {
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
								+ self.placeholder + "' value='" + value + "' class='" + self.type + ' ' + customClasses
								+ "' />";
						}

					};

				self.html = checkType(renderAs);

				return self.html;
			},
			validate    : function (value) {
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

				_.each(self.validation, function (value, key, list) {
					if (valid)
						valid = self.value.search(ValidationPatterns[value]) !== -1; // checking to see if this is true/matches
				});

				if (valid)
					valid = checkType(validateAs);
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
