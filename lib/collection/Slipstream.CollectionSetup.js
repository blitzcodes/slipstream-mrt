;
(function () {
	/*
	 ### `Slipstream.Collection(config)`
	 > Type: Class, Returns: Object

	 #### Description
	 > A subclass of the [Slipstream.Collection]{https://github.com/blitzcodes/slipstream-mrt/wiki/Slipstream.Collection). This class directly extends/inherits from the Meteor.Collection class itself.
	 >
	 > This subclass is designed to effectively set up any and all publish and subscribe configuration for the individual Collections. While this could of been left as a simple initialization method in the collection class, it just felt that the handling of pub/subs was unique enough that it didn't quite belong with the other controls.

	 #### Parameters
	 > `config` - JSON
	 > Please refer to [Slipstream.Drift Configuration]{https://github.com/blitzcodes/slipstream-mrt/wiki/Slipstream.Drift#configuration).
	 */
	Slipstream.CollectionSetup = function (config, columns) {
		var colName = config.name,
			self; // To be defined as required between the client & server, to support the expected publish/subscribe requirements needed

		if (Meteor.isServer) {
			// On the server side, the collection must precede any of the publish commands, so lets create it
			self = new Meteor.Collection(colName);

			var publishers = config.publish, // Get the config publish value
				publishCol = function () { // Define the default case for publishing a collection
					var pubCheck = {};

					// Append a check for the userId if this slipstream is checking for it
					if (config.options.requireUserId)
						pubCheck.userId = this.userId;

					config.debug(_.sprintf("collection::publish - pubname = %s, pubCheck = %s",
						colName, _.stringify(pubCheck)), 'init', 'collection');

					// Collection returns the expected results based on check
					return self.find(pubCheck);
				};

			// Now lets start reviewing how the config.publish variable was set...

			// If the var is undefined, we'll use the default defined above
			if (_.isUndefined(publishers))
				publishers = publishCol;

			// If the var is set to a function (or the default func above), we can just add this single publish to Meteor
			if (_.isFunction(publishers)) {
				Meteor.publish(colName, publishers);
			}
			// If the var is an object, and has multiple required publishers, lets set them up now, likely custom calls vs. a default override
			else if (_.isObject(publishers)) {
				// Again, if the default name of the slipstream or keyword default wasn't used, lets place in the standard call
				if (!_.has(publishers, colName) || !_.has(publishers, 'default'))
					Meteor.publish(colName, publishCol);

				// Now lets run through the list and add each publisher name / func to Meteor
				_.each(publishers, function (func, name) {
					Meteor.publish(name, func);
				});
			}
		}
		else if (Meteor.isClient) {
			// On the client side of things, we must first create all subscriptions before we create the collection object, so lets get a list of the subscribers
			var subscribers = config.subscribe;

			config.debug("collection::subscribe - subname " + colName, 'init', 'collection');

			// If there was no subscriber specific, we're setting up the default
			if (_.isUndefined(subscribers))
				subscribers = colName;

			// If the subscriber was set to a string (or default above), lets add it now
			if (_.isString(subscribers)) {
				Meteor.subscribe(subscribers);
			}
			// If the subscribers were sent as an array, lets add each one now
			else if (_.isArray(subscribers)) {
				// Again, if the default name of the slipstream or keyword default wasn't used, lets place in the standard call
				if (!_.has(subscribers, colName) || !_.has(subscribers, 'default'))
					Meteor.subscribe(colName);

				// Now lets run through the list and add each subscriber name to Meteor
				_.each(subscribers, function (name) {
					Meteor.subscribe(name);
				});
			}

			// We're able to call set up the collection now that all of the required subscribers have been set up
			self = new Meteor.Collection(colName);
		}

		_.extend(self, {
			permissions : function (type) {
				keys =
					[
					];

				if (_.isUndefined(type))
					type = 'insert';

				_.each(columns, function (column, key) {
					if (column.permissions[type])
						keys.push(key);
				});

				return keys;
			}
		});

		if (Meteor.isServer) {
			if (config.options.requireUserId) {
				var ownsDocument = function (userId, doc) {
					return doc && doc.userId === userId;
				};

				Meteor.startup(function () {
					self.allow({
						// Ensure that only the original user can update or delete their entries
						update : ownsDocument,
						remove : ownsDocument
					});
				});
			}

			Meteor.startup(function () {
				self.deny({
					// This check is to help prevent unauthorized or mistaken insertion of fields that aren't
					// in this collection to begin with, to ensure the needed fields are passed and reduce fragmentation
					insert : function (userId, post, fieldNames) {
						return (_.without(fieldNames, self.permissions('insert')).length > 0);
					},

					// This check is to help prevent unauthorized or mistaken updating of fields that either aren't
					// in this collection to begin with, or deemed to be locked in after insertion
					update : function (userId, post, fieldNames) {
						config.debug(_.sprintf("Updateable fields found = %s",
							(_.without(fieldNames, self.updateableColumns()).length > 0)), 'collection');

						return (_.without(fieldNames, self.permissions('update')).length > 0);
					}
				});
			});
		}

		return self;
	};
}());
