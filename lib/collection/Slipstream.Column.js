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
            return Slipstream.throwError(601, "Unable to define Column, no options or column name supplied.");

        _.defaults(options, {
            type: 'text',
            classes: '',
            default: '',
            attrs: '',
            html: '',
            debug: false,
            validation: [
            ],
            updateMethod: "$set"
        });

        options.permissions = options.permissions || {};
        _.defaults(options.permissions, {
            insert: true,
            update: true
        });

        var columnName = options.name,
            self = {
                name: columnName,
                jqId: "#" + columnName,
                label: options.label || columnName,
                type: options.type,
                classes: options.classes,
                placeholder: options.placeholder || options.label || columnName,
                default: options.default || '',

                attrs: options.attrs,
                html: options.html,
                debug: options.debug,
                validation: options.validation,

                updateMethod: options.updateMethod,

                permissions: options.permissions,

                process: function (value) {
                    if (_.isFunction(options.process))
                        self.value(options.process(value));
                    else
                        self.value(value);

                    if (config.checkDebug('client', 'column'))
                        Slipstream.debug("column::process - column = " + columnName + ", value = " + value
                            + ", customProcess = "
                            + _.isFunction(options.process));

                    return self.value();
                },
                render: function () {
                    self.html = checkType(config.renderAs,
                        _.pick(self, 'name', 'placeholder', 'type', 'classes', 'value'));

//					Slipstream.debug('column::render' + self.html);

                    return self.html;
                },
                validate: function (value) {
                    var valid = true;

                    var debug = "column::valid - name " + self.name +
                        ", validateArr = " + _.stringify(self.validation);

//					if (valid)
//						valid = checkType(config.validateAs, _.pick(self, 'value', 'jqId', 'placeholder'));

                    _.each(self.validation, function (key) {
                        debug += ", regex " + key;
                        if (_.has(config.validation, key))
                            valid = valid && value.search(config.validation[key]) !== -1; // checking to see if this is true/matches
                    });

                    if (valid)
                        self.value(value);

                    if (config.checkDebug('client', 'column'))
                        Slipstream.debug(debug + ", valid = " + valid);

                    return valid;
                },
                value: function (value) {
                    if (_.isUndefined(self._value))
                        self._value = self.default;
                    if (!_.isUndefined(value))
                        self._value = value || self.default;
                    return self._value;
                },
                setValueFromTemplate: function (t) {
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

            if (self.debug === true)
                Slipstream.debug("column::checkType - Type for " + type + ", typeof " + typeof renderAs[type]);

            return func[type](param);
        };

        return self;
    };
}());
