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
isAdmin = function (user) {
	if (!user || typeof user === 'undefined')
		return false;
	return !!user.isAdmin;
}
getSetting = function (setting, defaultValue) {
	var settings = Settings.find().fetch()[0];
	if (settings) {
		return settings[setting];
	}
	return typeof defaultValue === 'undefined' ? '' : defaultValue;
}
//getSetting = function(setting, defaultSetting){
//	var settingsObject=Settings.find().fetch()[0];
//	return (settingsObject && settingsObject[setting]) ? settingsObject[setting] : defaultSetting;
//}
ownsDocument = function (userId, doc) {
	return doc && doc.userId === userId;
}
