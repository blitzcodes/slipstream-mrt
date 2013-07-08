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
		),
		log   : _.extend(new Meteor.Collection(null),
			{
				error   : function (message) {
					return this.insert({message : "<strong>Error</strong> " + message, seen : false, type : 'error'});
				},
				success : function (message) {
					return this.insert({message : "<strong>Success</strong> "
						+ message, seen         : false, type : 'success'});
				},
				warning : function (message) {
					return this.insert({message : "<strong>Warning</strong> " + message, seen : false, type : 'alert'});
				},
				info    : function (message) {
					return this.insert({message : "<strong>Info</strong> " + message, seen : false, type : 'info'});
				},
				clear   : function () {
					return this.remove({seen : true});
				}
			}
		)
	};

	if (Meteor.isClient) {
		Meteor.Router.filters({
			'clearErrors' : function (page) {
				Slipstream.log.clear();
				return page;
			}
		});
		Meteor.Router.filter('clearErrors');

		Meteor.startup(function () {
			var tplList = Template["logList"];

			tplList.helpers({
				errors : function () {
					return Slipstream.log.find();
				}
			});
			tplList.rendered = function () {
				var log = this.data;
				Meteor.defer(function () {
					Slipstream.log.update(log._id, {$set : {seen : true}});
				});
			};
		});
	}
}());
