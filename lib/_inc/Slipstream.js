;
(function () {
	Slipstream = {
		// Creating a null collection as not to store any data server side
		Error : _.extend(new Meteor.Collection(null),
			{
				log   : function (message) {
					return this.insert({message : message, seen : false});
				},
				clear : function () {
					return this.remove({seen : true});
				}
			}
		)
	};

	if (Meteor.isClient) {
		Meteor.Router.filters({
			'clearErrors' : function (page) {
				Slipstream.Error.clear();
				return page;
			}
		});
		Meteor.Router.filter('clearErrors');
	}
}());
