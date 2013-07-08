;
(function () {
	Slipstream.Method = function (config, col) {
		var methodData = {},
			self = {
				userHasAuth : function () {
					var user = Meteor.user(),
						result = true;

					// check that user can post
					if (config.requireUserId && (!user || !canPost(user))) {
						result = false;
						throw new Meteor.Error(601, 'You need to login to create and update your project.');
					}

					return result;
				},
				post        : function (data) {
					var refId = '';

					//noinspection JSValidateTypes
					if (config.bypassDefaultFields !== true) {
						data = _.extend(data, {
							dateCreated  : parseInt(data.dateCreated) || new Date().getTime(),
							dateModified : new Date().getTime()
						});
					}

					if (config.debug.method === true)
						Meteor._debug("method::post - data = " + JSON.stringify(data));

					if (data._id) {
						col.update({_id : data._id}, _.omit(data, '_id'), function (error) {
							if (error) {
								Slipstream.log.error("There was an error updating your " + this.name
									+ " entry, please try again.");
								throw new Meteor.Error(601, JSON.stringify(error.reason));
							}
							else {
								Slipstream.log.success("Your entry has been successfully updated!");
								refId = data._id;
								col.loadValues(data);
							}
						});
					}
					else {
						col.insert(_.omit(data, '_id'), function (error, id) {
							if (id) {
								Slipstream.log.success("Your entry has been successfully inserted!");
								refId = id;
								col.loadValues(data);
							}
							else {
								Slipstream.log.error("There was an error inserting your " + this.name
									+ " entry, please try again.");
								throw new Meteor.Error(601, JSON.stringify(error.reason));
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
					Meteor._debug("method::run method[methodName] - data = " + JSON.stringify(data) + ", userId = "
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
