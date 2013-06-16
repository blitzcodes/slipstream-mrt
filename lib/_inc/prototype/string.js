String.prototype.ucwords = function () {
	return this.toLowerCase().replace(/^.|\s\S/g, function (a) { return a.toUpperCase(); });
};

String.prototype.lastChar = function () {
	return this.charAt(this.length - 1);
};

// Credit to: http://www.sitekickr.com/coda/javascript/make-word-pluralize
String.prototype.pluralize = function () {
	if (this.lastChar() === 'y') {
		if ((this.charAt(this.length - 2)).isVowel()) {
			// If the y has a vowel before it (i.e. toys), then you just add the s.
			return this + 's';
		}
		else {
			// If a this ends in y with a consonant before it (fly), you drop the y and add -ies to make it pluralize.
			return this.slice(0, -1) + 'ies';
		}
	}
	else if (this.substring(this.length - 2) === 'us') {
		// ends in us -> i, needs to preceed the generic 's' rule
		return this.slice(0, -2) + 'i';
	}
	else if (
		[
			'ch',
			'sh'
		].indexOf(this.substring(this.length - 2)) !== -1 ||
			[
				'x',
				's'
			].indexOf(this.lastChar()) !== -1) {
		// If a this ends in ch, sh, x, s, you add -es to make it pluralize.
		return this + 'es';
	}
	else {
		// anything else, just add s
		return this + 's';
	}
};