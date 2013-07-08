;
(function () {
	Slipstream = {
		debugging  : true,
		debug      : function (message) {
			if (Slipstream.debugging)
				Meteor._debug(message);
		}
	};
}());
