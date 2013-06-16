;
(function () {
	Slipstream = {
		Errors : new Meteor.Collection(null)
	};

	displayError = function (message) {
		return Slipstream.Errors.insert({message : message, seen : false});
	};

	clearErrors = function () {
		return Slipstream.Errors.remove({seen : true});
	};
}());
