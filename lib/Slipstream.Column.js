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
		return {
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
				var value = this.value === false || this.value === 0 || this.value ? this.value : this.default;

				classes = classes || '';

				switch (this.type) {
					case InputTypes.textarea:
						this.html = "<textarea id='" + this.name + "' placeholder='" + this.placeholder + "' class='"
							+ this.type + ' '
							+ classes
							+ "'>" + value
							+ "</textarea>";
						break;
					case InputTypes.url:
					case InputTypes.email:
					case InputTypes.phone:
					case InputTypes.tel:
					case InputTypes.hidden:
					case InputTypes.text:
						this.html = "<input id='" + this.name + "' type='" + this.type + "' placeholder='"
							+ this.placeholder + "' value='"
							+ value + "' class='" + this.type + ' ' + classes + "' />";
						break;
				}

				return this.html;
			}
		};
	};
}());
