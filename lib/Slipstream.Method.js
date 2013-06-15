;
(function () {
	//	debug("Slipstream.Method");

	Slipstream.Method = function (list) {
		var self = {
			userHasAuth : function () {
				var user = Meteor.user(),
					result = true;

				// check that user can post
				if (!user || !canPost(user)) {
					result = false;
					throw new Meteor.Error(601, 'You need to login to create and update your project.');
				}

				return result;
			},
			post        : function (data) {
				var refId = '';

				//noinspection JSValidateTypes
				data = _.extend(data, {
					dateCreated  : parseInt(data.dateCreated) || new Date().getTime(),
					dateModified : new Date().getTime()
				});

				this.insert(data, function (error, id) {
					if (id) {
						refId = id;
						list.loadValues(data);
					}
					else {
						displayError("There was an error updating your " + this.name + " entry, please try again.");
						throw new Meteor.Error(601, JSON.stringify(error.reason));
					}
				});

				return refId;
			}
		};

		return self;
	};
}());
