;
(function () {
	/*
	 ### `Slipstream.Method(config, Col)`
	 > Type: Class, Returns: Object

	 #### Description
	 > A subclass of the [Slipstream.Drift]{https://github.com/blitzcodes/slipstream-mrt/wiki/Slipstream.Drift).

	 #### Parameters
	 > `config` - JSON
	 > Please refer to [Slipstream.Drift Configuration]{https://github.com/blitzcodes/slipstream-mrt/wiki/Slipstream.Drift#configuration).
	 >
	 > `Col` - object
	 > An instance of the [Slipstream.Collection]{https://github.com/blitzcodes/slipstream-mrt/wiki/Slipstream.Collection) class configured for this Drift subclass.
	 */
	Slipstream.Method = function (config, Col) {

		Slipstream.debug.groupCollapsed("Init Methods");

		var methodData = {},
			self = {
				userHasAuth                : function () {
					var user = _.has(Meteor,'user') ? Meteor.user() : null,
						result = true;

					// check that user can post
					if (Col.requireUserId) {
						if (!user)
							result = false;
						else {
							if (user.isAdmin)
								result = true;
						}
					}

					if (!result)
						Slipstream.debug.throwError(601, 'You must be logged in to perform this action.');

					return result;
				},
				post                       : function (data) {
					var result = false;

					if (self.userHasAuth()) {
						data = Col.process(data);

						config.debug(
							[
								'client',
								'method'
							], "Method.post(data) init", 'method name = "' + config.name + '"',
							"preProcessed data [] = ", data);

						// If we're using the default date fields, ensure we update the modified date here
						//						if (Col.useDefaultDateFields === true)
						//							data['dateModified'] = new Date().getTime();

						if (data._id) {
							// We want to update the record with the matching _id, and with the fields we're updating, we
							// want to ensure _id isn't included since it can't be modified
							Col.update({_id : data._id}, self.prepareColumnUpdateMethods(data), function (error) {
								if (error) {
									Slipstream.log.error("There was an error updating your " + config.name
										+ " entry, please try again.");
									Slipstream.debug.throwError(601, _.stringify(error.reason));
								}
								else {
									Slipstream.log.success("Your entry has been successfully updated!");
									result = data._id;
									//									Col.loadValues(data);
								}
							});
						}
						else {
							// If we're using the default date fields, ensure we setting the create date here
							//							if (Col.useDefaultDateFields === true)
							//								data['dateCreated'] = new Date().getTime();

							// Ensure we're not passing an _id, clearly blank to reach there, into the insert or else this will result in an error
							Col.insert(_.omit(data, '_id'), function (error, id) {
								if (id) {
									Slipstream.log.success("Your entry has been successfully inserted!");
									result = id;
									//									Col.loadValues(data);
								}
								else {
									Slipstream.log.error("There was an error inserting your " + config.name
										+ " entry, please try again.");
									Slipstream.debug.throwError(601, _.stringify(error.reason));
								}
							});
						}

						config.debug(
							[
								'client',
								'method'
							], "Method.post(data) - final", 'results = "' + result + '"', "postProcessed data [] = ",
							data);
					}

					return result;
				},
				prepareColumnUpdateMethods : function (data) {
					var updateArr = _.omit(data, '_id'),
						updateResults = {};

					config.debug(
						[
							'client',
							'method'
						], "Method.prepareColumnUpdateMethods(data)", "columnsToUpdate [] = ", updateArr);

					_.each(updateArr, function (value, key) {
						if (!_.has(updateResults, Col.columns[key].updateMethod))
							updateResults[Col.columns[key].updateMethod] = {};

						updateResults[Col.columns[key].updateMethod][key] = value;
					});

					config.debug(
						[
							'client',
							'method'
						], "Method.prepareColumnUpdateMethods(data)", "updatePatterns [] = ", updateResults);

					return updateResults;
				},
				removeEntry                : function (data) {
					var result = false;

					if (self.userHasAuth()) {
						config.debug(
							[
								'client',
								'method'
							], "Method.removeEntry(data) - entry {} = ", data || {});

						if (data) {
							Col.remove(data._id, function (error) {
								if (error)
									Slipstream.debug.throwError(401,
										"An error occurred attempting to remove your entry, please try again.");
								else
									result = true;
							});
						}
					}

					if (!result)
						Slipstream.debug.throwError(401,
							"An error occurred attempting to remove your entry, please try again.");

					return result;
				}
			};

		// Set up the method data
		methodData[config.name] = function (data) {
			return self.post(data);
		};

		methodData[config.name + "Remove"] = function (data) {
			return self.removeEntry(data);
		};

		if (_.isObject(config.methods))
			_.extend(methodData, config.methods);

		// Add the method data to the Meteor methods
		Meteor.methods(methodData);

		Slipstream.debug.groupEnd();

		return self;
	};
}());
