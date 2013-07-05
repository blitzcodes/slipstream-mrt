;
(function () {
	InputTypes = {
		text     : 'text',
		hidden   : 'hidden',
		url      : 'url',
		email    : 'email',
		phone    : 'tel',
		tel      : 'tel',
		textarea : 'textarea',
		editor   : 'editor',
		select   : 'select',
		checkbox : 'checkbox',
		radio    : 'radio'
	};

	ValidationPatterns = {
		required : /^.+$/i,
		email    : /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/,
		phone    : /^\(?(\d{1})?\)?[-\. ]?(\d{3})\)?[-\. ]?(\d{3})[-\. ]?(\d{4})(\s+e?x?t?[\d]*)?$/,
		tel      : /^\(?(\d{1})?\)?[-\. ]?(\d{3})\)?[-\. ]?(\d{3})[-\. ]?(\d{4})(\s+e?x?t?[\d]*)?$/,
		postal   : /^([0-9]{5})|(\s*[a-ceghj-npr-tvxy]\d[a-ceghj-npr-tv-z](\s)?\d[a-ceghj-npr-tv-z]\d\s*)$/i
	};

	Slipstream.Column = function (options) {
		var self = {
			/***************************
			 FIELD Attributes & Methods
			 ****************************/
			name        : _.trim(options.name),
			jqId        : "#" + _.trim(options.name),
			label       : _.trim(options.label),
			type        : _.trim(options.type),
			placeholder : options.placeholder || options.label,
			default     : options.default,
			attrs       : options.attrs,
			value       : '',
			html        : '',
			validation  :
				[
				],

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
								+ self.placeholder + "' value='" + value + "' class='" + self.type + ' ' + customClasses
								+ "' />";
						}

					};

				self.html = funcType(renderAs);

				return self.html;
			},
			valid    : function () {
				var valid = true,
					validateAs = {
						"select"  : function () {
							return !(!self.value || self.value == $(self.jqId).find('option:first').val());
						},
						"default" : function () {
							return !(!self.value || self.value === self.placeholder);
						}
					};

				_.each(self.validation, function (element, index, list) {
					if (valid)
						valid = self.value.search(ValidationPatterns[element]) !== -1; // checking to see if this is true/matches
				});

				if (valid)
					valid = funcType(validateAs);
				return valid;

			},

		};

		var funcType = function funcType(func) {
			var type = self.type;

			if (type === 'editor')
				type = 'textarea';

			else if (typeof func[type] !== 'function')
				type = 'default';

			//				debug("Type for "+type+", typeof "+typeof renderAs[type]);
			return func[type]();
		}

		return self;
	};
}());
