;
(function () {
    /*
     ### `Slipstream.Collection(config)`
     > Type: Class, Returns: Object

     #### Description
     > A subclass of the [Slipstream.Drift]{https://github.com/blitzcodes/slipstream-mrt/wiki/Slipstream.Drift). This class directly extends/inherits from the Meteor.Collection class itself, which a slue of customer functionality built on top to support the Slipstream, after it has been pre-configured by the [Slipstream.CollectionSetup]{https://github.com/blitzcodes/slipstream-mrt/wiki/Slipstream.CollectionSetup) to properly set up the necessary pub/subs.

     #### Parameters
     `config` - JSON
     > Please refer to [Slipstream.Drift Configuration]{https://github.com/blitzcodes/slipstream-mrt/wiki/Slipstream.Drift#configuration).
     */
    Slipstream.Collection = function (config) {
        var columns = Slipstream.ColumnManager(config),
            col = Slipstream.CollectionSetup(config, columns),
            self = _.extend(col, {
                columns: columns,
                inputs: {},
                values: {},
                errors: {},
                requireUserId: config.options.requireUserId,
                useDefaultDateFields: config.options.useDefaultDateFields,
                hasId: function () {
                    return !!columns._id.value; // Ensure the return is set to a boolean
                },
                columnNames: function () {
                    return _.keys(columns);
                },
                loadValues: function (data) {
                    if (config.checkDebug('client', 'collection'))
                        Slipstream.debug("collection::loadValues - columns = " + this.columnNames() + ', data ='
                            + _.stringify(data));

                    var data = data || {};

                    _.each(self.columnNames(), function (key) { // this referring to one of the filed columnNames in the columnNames array
                        self.values[key] = columns[key].value(data[key]);
                    });

                    return self.values;
                },
                loadById: function (id) {
                    self.loadValues(col.findOne({"_id": id}));
                },
                loadWhere: function (where) {
                    self.loadValues(col.findOne(where));
                },
                loadByTemplate: function (t) {
                    var data = {};

                    _.each(self.columnNames(), function (key) {
                        self.values[key] = columns[key].setValueFromTemplate(t);
                    });

                    if (config.checkDebug('client', 'collection'))
                        Slipstream.debug("template::loadByTemplate - data " + _.stringify(data));

                    return self.values;
                },
                getInputs: function () {
                    _.each(self.columnNames(), function (key) { // this referring to one of the filed columnNames in the columnNames array
                        self.inputs[key] = columns[key].render();
                    });

                    if (config.checkDebug('client', 'collection'))
                        Slipstream.debug("collection::renderInput - result = " + _.stringify(self.inputs));

                    return self.inputs;
                },
                getColumns: function () {
                    _.each(self.columnNames(), function (key) { // this referring to one of the filed columnNames in the columnNames array
                        columns[key].render();
                    });

                    if (config.checkDebug('client', 'collection'))
                        Slipstream.debug("collection::getColumns - result = " + _.stringify(columns));

                    return columns;
                },
                process: function (data) {
                    // The data may not contain all fields, but ensure we're only utilizing data that belongs to this col
                    var arr = _.pick(data, self.columnNames());

                    //				if (config.checkDebug('client','collection'))
                    //					Slipstream.debug("collection::process - arr:before = " + _.stringify(arr));

                    // If a global override is set for the process data, run that now
                    if (_.isFunction(config.process)) {
                        arr = config.process(arr);
                    }// Else, process data column by column with their default or extended process functions
                    else {
                        _.each(arr, function (value, key) { // For each column found in the
                            arr[key] = columns[key].process(value);
                        });

                        if (self.requireUserId) {
                            arr['userId'] = arr.userId || data.userId || Meteor.userId();
                        }
                    }

                    if (_.isFunction(config.postProcess))
                        arr = config.postProcess(arr);

                    if (config.checkDebug('client', 'method'))
                        Slipstream.debug("collection::process - arr = " + _.stringify(arr));

                    return arr;
                },
                validate: function (data) {
                    // The data may not contain all fields, but ensure we're only utilizing data that belongs to this col
                    var arr = _.pick(data, self.columnNames()),
                        result = true;

                    self.errors =
                        [
                        ];
                    clearInterval(Slipstream.log.logLooper);
                    Slipstream.log.fadeOutLastLog(200);

                    if (_.isFunction(config.validate)) // If a global override is set for the process data, run that now
                        result = config.validate(arr);
                    else { // Else, process data column by column with their default or extended process functions
                        _.each(arr, function (value, key) { // For each column found in the
                            if (!columns[key].validate(value))
                                self.errors.push("Please enter a valid " + columns[key].label);
                            //							results[key] = column[key].error;
                        });
                        result = self.errors.length == 0;
                    }

                    if (config.checkDebug('client', 'collection'))
                        Slipstream.debug("collection::validate - arr = " + _.stringify(arr) + " errors = "
                            + _.stringify(self.errors) + ", result = " + result);

                    return result;
                },
                prepareColumns: function (data) {
                    var updateArr = _.omit(data, '_id'),
                        updateResults = {};

                    if (config.checkDebug('client', 'collection'))
                        Slipstream.debug("coolection::prepareColumns - updateArr = " + _.stringify(updateArr));

                    _.each(updateArr, function (value, key) {
                        if (!_.has(updateResults, columns[key].updateMethod))
                            updateResults[columns[key].updateMethod] = {};

                        updateResults[columns[key].updateMethod][key] = value;
                    });

                    if (config.checkDebug('client', 'collection'))
                        Slipstream.debug("coolection::prepareColumns - updatedResults = "
                            + _.stringify(updateResults));

                    return updateResults;
                }
            });

        return self;
    };
}());
