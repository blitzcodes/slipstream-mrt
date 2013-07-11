;
(function () {
	Slipstream.Method = function (config, Col) {
		var methodData = {},
			self = {
				userHasAuth : function () {
					var user = Meteor.user(),
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
						Slipstream.throwError(601, 'You must be logged in to perform this action.');

					return result;
				},
				post        : function (data) {
					var refId = '';

					// If we're using the default date fields, ensure we update the modified date here
					if (Col.useDefaultDateFields === true)
						data['dateModified'] = new Date().getTime();

					if (data._id) {
						// We want to update the record with the matching _id, and with the fields we're updating, we
						// want to ensure _id isn't included since it can't be modified
						Col.update({_id : data._id}, _.omit(data, '_id'), function (error) {
							if (error) {
								Slipstream.log.error("There was an error updating your " + this.name
									+ " entry, please try again.");
								Slipstream.throwError(601, JSON.stringify(error.reason));
							}
							else {
								Slipstream.log.success("Your entry has been successfully updated!");
								refId = data._id;
								Col.loadValues(data);
							}
						});
					}
					else {
						// If we're using the default date fields, ensure we setting the create date here
						if (Col.useDefaultDateFields === true)
							data['dateCreated'] = new Date().getTime();

						Col.insert(_.omit(data, '_id'), function (error, id) {
							if (id) {
								Slipstream.log.success("Your entry has been successfully inserted!");
								refId = id;
								Col.loadValues(data);
							}
							else {
								Slipstream.log.error("There was an error inserting your " + this.name
									+ " entry, please try again.");
								Slipstream.throwError(601, JSON.stringify(error.reason));
							}
						});
					}

					if (config.debug.method === true)
						Slipstream.debug("method::post - refId= " + refId + "- data = " + JSON.stringify(data));

					return refId;
				}
			};

		// Set up the method data
		methodData[config.name] = function (data) {
			if (self.userHasAuth()) {
				data = Col.process(data);

				if (config.debug.method && Meteor.isClient)
					Slipstream.debug("method::run method[methodName] - data = " + JSON.stringify(data));

				data.insertId = self.post(data);
			}

			return data;
		};

		// Add the method data to the Meteor methods
		Meteor.methods(methodData);

		return self;
	};
}());
