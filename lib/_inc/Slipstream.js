;
(function () {
	Slipstream = {
		Error : _.extend({
				log   : function (message) {
					return this.insert({message : message, seen : false});
				},
				clear : function () {
					return this.remove({seen : true});
				}
			}, new Meteor.Collection(null) // Creating a null collection as not to store any data server side
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
