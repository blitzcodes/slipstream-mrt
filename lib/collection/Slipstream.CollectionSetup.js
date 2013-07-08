;
(function () {
	Slipstream.CollectionSetup = function (config) {
		var self; // To be defined as required between the client & server, to support the expected publish/subscribe requirements needed

		if (Meteor.isServer) {
			// On the server side, the collection must precede any of the publish commands, so lets create it
			self = new Meteor.Collection(config.name);

			var publishers = config.publish, // Get the config publish value
				publishCol = function () { // Define the default case for publishing a collection
					var pubCheck = {};

					// Append a check for the userId if this slipstream is checking for it
					if (config.requireUserId)
						pubCheck.userId = this.userId;

					if (config.debug.init === true)
						Meteor._debug("collection::publish - pubname " + config.name + ", pubCheck = "
							+ JSON.stringify(pubCheck));

					// Collection returns the expected results based on check
					return self.find(pubCheck);
				};

			// Now lets start reviewing how the config.publish variable was set...

			// If the var is undefined, we'll use the default defined above
			if (_.isUndefined(publishers))
				publishers = publishCol;

			// If the var is set to a function (or the default func above), we can just add this single publish to Meteor
			if (_.isFunction(publishers)) {
				Meteor.publish(config.name, publishers);
			}
			// If the var is an object, and has multiple required publishers, lets set them up now, likely custom calls vs. a default override
			else if (_.isObject(publishers)) {
				// Again, if the default name of the slipstream or keyword default wasn't used, lets place in the standard call
				if (!_.has(publishers, config.name) || !_.has(publishers, 'default'))
					Meteor.publish(config.name, publishCol);

				// Now lets run through the list and add each publisher name / func to Meteor
				_.each(publishers, function (func, name) {
					Meteor.publish(name, func);
				});
			}
		}
		else if (Meteor.isClient) {
			// On the client side of things, we must first create all subscriptions before we create the collection object, so lets get a list of the subscribers
			var subscribers = config.subscribe;

			if (config.debug.init === true)
				Meteor._debug("collection::subscribe - subname " + config.name + "");

			// If there was no subscriber specific, we're setting up the default
			if (_.isUndefined(subscribers))
				subscribers = config.name;

			// If the subscriber was set to a string (or default above), lets add it now
			if (_.isString(subscribers)) {
				Meteor.subscribe(subscribers);
			}
			// If the subscribers were sent as an array, lets add each one now
			else if (_.isArray(subscribers)) {
				// Again, if the default name of the slipstream or keyword default wasn't used, lets place in the standard call
				if (!_.has(subscribers, config.name) || !_.has(subscribers, 'default'))
					Meteor.subscribe(config.name);

				// Now lets run through the list and add each subscriber name to Meteor
				_.each(subscribers, function (name) {
					Meteor.subscribe(name);
				});
			}

			// We're able to call set up the collection now that all of the required subscribers have been set up
			self = new Meteor.Collection(config.name);
		}

		return self;
	};
}());
