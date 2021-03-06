;
(function () {
	/*
	 ### `Slipstream.Column(options, config)`
	 > Type: Class, Returns: Object

	 #### Description
	 > A subclass of the [Slipstream.Collection]{https://github.com/blitzcodes/slipstream-mrt/wiki/Slipstream.Collection).

	 #### Parameters
	 > `options` - JSON
	 > The definition and configuration specific to the new Column object that's being creating.  See [Slipstream.Column Configuration]{https://github.com/blitzcodes/slipstream-mrt/wiki/Slipstream.Column#configuration) for full details on the breadth of options to choose from when setting up a Column.
	 >
	 > `config` - JSON
	 > Please refer to [Slipstream.Drift Configuration]{https://github.com/blitzcodes/slipstream-mrt/wiki/Slipstream.Drift#configuration).
	 */
	Slipstream.Column = function (options, config) {
		if (!_.isObject(options) || !_.isString(options.name))
			return Slipstream.debug.throwError(601, "Unable to define Column, no options or column name supplied.");

		_.defaults(options, {
			type         : 'text',
			classes      : '',
			default      : '',
			attrs        : '',
			html         : '',
			validation   :
				[
				],
			updateMethod : "$set",
			permissions  : _.defaults(options.permissions || {}, {
				insert : true,
				update : true,
				remove : true
			})
		});

		options.permissions = options.permissions || {};
		_.defaults(options.permissions, {
			insert : true,
			update : true
		});

		var _val,
			columnName = options.name,
			self = {
				name        : columnName,
				jqId        : "#" + columnName,
				label       : options.label || columnName,
				type        : options.type,
				classes     : options.classes,
				placeholder : options.placeholder || options.label || columnName,
				default     : options.default || '',

				attrs      : options.attrs,
				html       : options.html,
				validation : options.validation,

				updateMethod : options.updateMethod,

				permissions : options.permissions,

				process              : function (value) {
					if (_.isFunction(options.process))
						self.value(options.process(value));
					else
						self.value(value);

					config.debug(
						[
							'client',
							'column'
						], 'Column.process(value)', 'columnName = "' + columnName + '"',
						'value = ', value, 'isFunc(customProcess) = ', _.isFunction(options.process));

					return self.value();
				},
				render               : function () {
					self.html = checkType(config.renderAs,
						_.pick(self, 'name', 'placeholder', 'type', 'classes', 'value'));

					config.debug(
						[
							'client',
							'column'
						], 'Column.render() - html = "' + self.html + '"');

					return self.html;
				},
				validate             : function (value) {
					var valid = true,
						debug =
							[
							];

					//					if (valid)
					//						valid = checkType(config.validateAs, _.pick(self, 'value', 'jqId', 'placeholder'));

					_.each(self.validation, function (key) {
						var regex;

						if (_.isString(key) && _.has(config.validation, key)) // Check to see if a string was passed, and that it is a valid key within the list of validation types
							regex = config.validation[key];
						else if (_.isRegExp(key)) // Alternatively, see if a custom regex was passed in instead, and set that
							regex = key;
						else
							Slipstream.debug.throwError(602,
								"You have specified an invalid validation option. Please choose one of the predefined patterns, extend Slipstream and add your own custom label/regex patterns, or pass in a custom regex directly. Failed regex type: "
									+ key);
						if (regex)
							valid = valid && value.search(regex) !== -1; // checking to see if this is true/matches

						debug.push('Type: "' + key + '", Regex: ' + regex);
					});

					if (valid)
						self.value(value);

					config.debug(
						[
							'client',
							'column'
						], "Column.valid(value)", 'name = "' + self.name + '"',
						"validationChecksReviewed [] = ", debug, "isValid (bool) = " + valid);

					return valid;
				},
				value                : function (value) {
					if (_.isUndefined(_val))
						_val = self.default;
					if (!_.isUndefined(value))
						_val = value || self.default;
					return _val;
				},
				setValueFromTemplate : function (t) {
					var el = t.find(self.jqId);

					self.value(el ? el.value : self.default);

					return self.value();
				}
			};

		var checkType = function checkType(func, param) {
			var type = self.type;

			if (type === 'editor')
				type = 'textarea';

			else if (typeof func[type] !== 'function')
				type = 'default';

			config.debug(
				[
					'client',
					'column'
				], 'Column.checkType(...) - Type for "' + type + '"');

			return func[type](param);
		};

		return self;
	};
}());
