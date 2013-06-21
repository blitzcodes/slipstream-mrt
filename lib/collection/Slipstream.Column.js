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
		select   : 'select',
		checkbox : 'checkbox',
		radio    : 'radio'
	};

	Slipstream.Column = function (options) {
		var self = {
			/***************************
			 FIELD Attributes & Methods
			 ****************************/
			name        : options.name,
			label       : options.label,
			type        : options.type,
			placeholder : options.placeholder,
			default     : options.default,
			attrs       : options.attrs,
			value       : '',
			html        : '',

			render : function (classes) {
				// We need to allow for some falsey values, in the event options/columns are blank or unset
				var value = self.value === false || self.value === 0 || self.value ? self.value : self.default,
					customClasses = classes || '',
					renderAs = {
						"textarea" : function () {
							return "<textarea id='" + self.name + "' placeholder='" + self.placeholder + "' class='"
								+ self.type + ' ' + customClasses + "'>" + value + "</textarea>";
						}
					};

				if (typeof renderAs[self.type] !== 'function') {
					self.html = "<input id='" + self.name + "' type='" + self.type + "' placeholder='"
						+ self.placeholder + "' value='" + value + "' class='" + self.type + ' ' + customClasses
						+ "' />";
				}
				else
					self.html = renderAs[self.type]();

				return self.html;
			}
		};

		return self;
	};
}());
