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

	var ColumnProto = {
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
			var value = this.value === false || this.value === 0 || this.value ? this.value : this.default,
				customClasses = classes || '',
				renderAs = {
					"textarea" : function () {
						return "<textarea id='" + this.name + "' placeholder='" + this.placeholder
							+ "' class='"
							+ this.type + ' '
							+ customClasses
							+ "'>" + value
							+ "</textarea>";
					}
				};

			if (typeof renderAs[this.type] !== 'function') {
				this.html = "<input id='" + this.name + "' type='" + this.type + "' placeholder='"
					+ this.placeholder + "' value='"
					+ value + "' class='" + this.type + ' ' + customClasses + "' />";
			}
			else
				this.html = renderAs[this.type]();

			//				switch (this.type) {
			//					case InputTypes.textarea:
			//						this.html = "<textarea id='" + this.name + "' placeholder='" + this.placeholder + "' class='"
			//							+ this.type + ' '
			//							+ classes
			//							+ "'>" + value
			//							+ "</textarea>";
			//						break;
			//					case InputTypes.url:
			//					case InputTypes.email:
			//					case InputTypes.phone:
			//					case InputTypes.tel:
			//					case InputTypes.hidden:
			//					case InputTypes.text:
			//						this.html = "<input id='" + this.name + "' type='" + this.type + "' placeholder='"
			//							+ this.placeholder + "' value='"
			//							+ value + "' class='" + this.type + ' ' + classes + "' />";
			//						break;
			//				}

			return this.html;
		}
	};

	Slipstream.Column = function (options) {
		return Object.create(ColumnProto);
	};

	//	Slipstream.Column = function (options) {
	//		var self = {
	//			/***************************
	//			 FIELD Attributes & Methods
	//			 ****************************/
	//			name        : options.name,
	//			label       : options.label,
	//			type        : options.type,
	//			placeholder : options.placeholder,
	//			default     : options.default,
	//			attrs       : options.attrs,
	//			value       : '',
	//			html        : '',
	//
	//			render : function (classes) {
	//				// We need to allow for some falsey values, in the event options/columns are blank or unset
	//				var value = self.value === false || self.value === 0 || self.value ? self.value : self.default,
	//					customClasses = classes || '',
	//					renderAs = {
	//						"textarea" : function () {
	//							return "<textarea id='" + self.name + "' placeholder='" + self.placeholder
	//								+ "' class='"
	//								+ self.type + ' '
	//								+ customClasses
	//								+ "'>" + value
	//								+ "</textarea>";
	//						}
	//					};
	//
	//				if (typeof renderAs[self.type] !== 'function') {
	//					self.html = "<input id='" + self.name + "' type='" + self.type + "' placeholder='"
	//						+ self.placeholder + "' value='"
	//						+ value + "' class='" + self.type + ' ' + customClasses + "' />";
	//				}
	//				else
	//					self.html = renderAs[self.type]();
	//
	//				//				switch (self.type) {
	//				//					case InputTypes.textarea:
	//				//						self.html = "<textarea id='" + self.name + "' placeholder='" + self.placeholder + "' class='"
	//				//							+ self.type + ' '
	//				//							+ classes
	//				//							+ "'>" + value
	//				//							+ "</textarea>";
	//				//						break;
	//				//					case InputTypes.url:
	//				//					case InputTypes.email:
	//				//					case InputTypes.phone:
	//				//					case InputTypes.tel:
	//				//					case InputTypes.hidden:
	//				//					case InputTypes.text:
	//				//						self.html = "<input id='" + self.name + "' type='" + self.type + "' placeholder='"
	//				//							+ self.placeholder + "' value='"
	//				//							+ value + "' class='" + self.type + ' ' + classes + "' />";
	//				//						break;
	//				//				}
	//
	//				return self.html;
	//			}
	//		};
	//		return self;
	//	};
}());
