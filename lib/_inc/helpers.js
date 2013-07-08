canPost = function (user, returnError) {
	var user = (typeof user === 'undefined') ? Meteor.user() : user;

	// console.log('canPost', user, action, getSetting('requirePostInvite'));
	if (Meteor.isClient && !Session.get('settingsLoaded'))
		return false;

	if (!user) {
		return returnError ? "no_account" : false;
	}
	else if (user.isAdmin) {
		return true;
	}
	else {
		return true;
	}
}
