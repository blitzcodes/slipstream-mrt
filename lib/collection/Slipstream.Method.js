;
(function () {
	Slipstream.Method = function (col, options) {
		var methodData = {},
			self = {
				userHasAuth : function () {
					var user = Meteor.user(),
						result = true;

					// check that user can post
					if (options.requireUserId && (!user || !canPost(user))) {
						result = false;
						throw new Meteor.Error(601, 'You need to login to create and update your project.');
					}

					return result;
				},
				post        : function (data) {
					var refId = '';

					//noinspection JSValidateTypes
					if (options.bypassDefaultFields !== true) {
						data = _.extend(data, {
							dateCreated  : parseInt(data.dateCreated) || new Date().getTime(),
							dateModified : new Date().getTime()
						});
					}

					this.insert(data, function (error, id) {
						if (id) {
							refId = id;
							col.loadValues(data);
						}
						else {
							Slipstream.Error.log("There was an error updating your " + this.name
								+ " entry, please try again.");
							throw new Meteor.Error(601, JSON.stringify(error.reason));
						}
					});
					return refId;
				}
			};

		// Set up the method data
		methodData[options.name] = function (data) {
			if (Project.userHasAuth()) {
				var userId = data.userId || this.userId;

				data = _.extend(_.pick(data, Project.columnNames()), {
					userId : userId,
					title  : _.escapeHTML(data.title),
					slug   : _.slugify(data.title),
					desc   : _.escapeHTML(data.desc),
					author : data.author || getUsersDisplayName()
				});

				if (!data.title || !data.desc)
					return Slipstream.Error.log("Please enter a title and description.");

				//			displayError("Data is " + JSON.stringify(data));
				//			displayError("User is " + JSON.stringify(Meteor.user()));

				data.insertId = Project.post(data);
			}

			return data;
		};

		// Add the method data to the Meteor methods
		Meteor.methods(methodData);

		return self;
	};
}());
