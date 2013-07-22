;
(function () {
	/*
	 ### `Slipstream.log`
	 > Type: Function Wrapper, Returns: Varies

	 #### Description
	 >
	 */
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
			reset          : function () {
				Slipstream.log.clean();
				if ($("div.alert").length)
					$("div.alert").remove();
			},
			fadeOutLastLog : function (speed) {
				Slipstream.log.clear();
				if (_.isUndefined(speed))
					speed = 'normal';
				$("div.alert:first").fadeOut(speed, function () {
					$(this).remove()
				});
			},
			render         : function (template) {
				Meteor.defer(function () {
					//					Slipstream.debug.throwError("logRender::template " + _.stringify(template.data));
					Slipstream.log.update(template.data._id, {$set : {seen : true}});
				});
				if ($("div.alert").length) {
					this.logLooper = setInterval(function () {
						if (!$("div.alert").length)
							clearInterval(this.logLooper);

						Slipstream.log.fadeOutLastLog();
					}, 5000);
				}
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
					var visible = Slipstream.log.find();
					Slipstream.log.remove({});

					return visible;
				}
			});
			tplList.rendered = function () {
				Slipstream.log.render(this);
			};
		});
	}
}());
