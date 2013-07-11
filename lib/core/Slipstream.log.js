;
(function () {
	Slipstream.log = _.extend(new Meteor.Collection(null),
		{
			error          : function (message) {
				return this.insert({message : "<strong>Error</strong> " + message, seen : false, type : 'error'});
			},
			success        : function (message) {
				return this.insert({message : "<strong>Success</strong> "
					+ message, seen         : false, type : 'success'});
			},
			warning        : function (message) {
				return this.insert({message : "<strong>Warning</strong> " + message, seen : false, type : 'alert'});
			},
			info           : function (message) {
				return this.insert({message : "<strong>Info</strong> " + message, seen : false, type : 'info'});
			},
			clear          : function () {
				return this.remove({seen : true});
			},
			fadeOutLastLog : function (speed) {
				if (_.isUndefined(speed))
					speed = 'normal';
				$("div.alert:first").fadeOut(speed, function () {$(this).remove()});
			},
			logLooper      : null,
			fadeOutLogs    : function () {
				if ($("div.alert").length) {
					this.logLooper = setInterval(function () {
						if (!$("div.alert").length)
							clearInterval(this.logLooper);

						Slipstream.log.fadeOutLastLog();
					}, 5000);
				}
			},
			render         : function (log) {
				Meteor.defer(function () {
					this.update(log._id, {$set : {seen : true}});
				});
				this.fadeOutLogs();
			}
		});

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
				Slipstream.log.render(log);
			};
		});
	}
}());
