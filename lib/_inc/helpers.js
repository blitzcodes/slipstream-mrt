debug = function (message) {
	if (typeof console !== 'undefined') {
		console.log(message);
	}
}
canPost = function (user, returnError) {
	var user = (typeof user === 'undefined') ? Meteor.user() : user;

	// console.log('canPost', user, action, getSetting('requirePostInvite'));
	if (Meteor.isClient && !Session.get('settingsLoaded'))
		return false;

	if (!user) {
		return returnError ? "no_account" : false;
	}
	else if (isAdmin(user)) {
		return true;
	}
	else if (getSetting('requirePostInvite')) {
		if (user.isInvited) {
			return true;
		}
		else {
			return returnError ? "no_invite" : false;
		}
	}
	else {
		return true;
	}
}
