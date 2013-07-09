;
(function () {
	Slipstream.Method = function (config, Col) {
		var methodData = {},
			self = {
				requireUserId : config.options.requireUserId,
				userHasAuth   : function () {
					var user = Meteor.user(),
						result = true;

					// check that user can post
					if (self.requireUserId && (!user || !canPost(user))) {
						result = false;
						Slipstream.throwError(601, 'You need to login to create and update your project.');
					}

					return result;
				},
				post          : function (data) {
					var refId = '';

					//noinspection JSValidateTypes
					if (Col.useDefaultDateFields === true) {
						_.extend(data, {
							// If the date was set, ignore
							dateCreated  : parseInt(data.dateCreated) || new Date().getTime(),
							// Always update the modified date with new actions
							dateModified : new Date().getTime()
						});
					}

					if (config.debug.method === true)
						Slipstream.debug("method::post - data = " + JSON.stringify(data));

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
					return refId;
				}
			};

		// Set up the method data
		methodData[config.name] = function (data) {
			if (Project.userHasAuth()) {
				var userId = data.userId || this.userId;

				data = _.extend(_.pick(data, Project.columnNames()), {
					userId : userId,
					_id    : data._id,
					title  : _.escapeHTML(data.title),
					slug   : _.slugify(data.title),
					desc   : _.escapeHTML(data.desc),
					author : data.author || getUsersDisplayName()
				});

				if (!data.title || !data.desc)
					return Slipstream.log.error("Please enter a title and description.");

				if (config.debug === true && Meteor.isClient)
					Slipstream.debug("method::run method[methodName] - data = " + JSON.stringify(data) + ", userId = "
						+ userId);

				data.insertId = Project.post(data);
			}

			return data;
		};

		// Add the method data to the Meteor methods
		Meteor.methods(methodData);

		return self;
	};
}());
