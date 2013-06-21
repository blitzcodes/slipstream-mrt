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

	Slipstream.Column = function (options) {
		var self = {
			/***************************
			 FIELD Attributes & Methods
			 ****************************/
			name        : _.trim(options.name),
			label       : _.trim(options.label),
			type        : _.trim(options.type),
			placeholder : _.trim(options.placeholder),
			default     : options.default,
			attrs       : options.attrs,
			value       : '',
			html        : '',

			render : function (classes) {
				// We need to allow for some falsey values, in the event options/columns are blank or unset
				var value = self.value === false || self.value === 0 || self.value ? self.value : self.default,
					type = self.type,
					customClasses = classes || '',
					renderAs = {
						"textarea" : function () {
							return "<textarea id='" + self.name + "' placeholder='" + self.placeholder + "' class='"
								+ self.type + ' ' + customClasses + "'>" + value + "</textarea>";
						},
						"default"  : function () {
							self.html = "<input id='" + self.name + "' type='" + self.type + "' placeholder='"
								+ self.placeholder + "' value='" + value + "' class='" + self.type + ' ' + customClasses
								+ "' />";
						}

					};

				if (type === 'editor') {
					customClasses = 'editor';
					type = 'textarea';
				}
				else if (typeof renderAs[type] !== 'function') {
					type = 'default';
				}

				self.html = renderAs[type]();

				return self.html;
			}
		};

		return self;
	};
}());
