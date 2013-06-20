/**
 * WIP, currently broken till I learn more on the subject
 */

Tinytest.add('MeteorFile - read', function (test) {
	test.equal(1, 1, 'Expected values to be equal');
});

Tinytest.add('Slipstream.Drift - create object', function (test) {
	var Project = Slipstream.Drift('project', 'slug', {
		title  : Slipstream.Column({
			name        : 'title',
			label       : 'Project Title',
			type        : InputTypes.text,
			placeholder : 'Title',
			default     : ''
		}),
		desc   : Slipstream.Column({
			name        : 'desc',
			label       : 'Project Description',
			type        : InputTypes.textarea,
			placeholder : 'Description',
			default     : ''
		}),
		author : Slipstream.Column({
			name        : 'author',
			label       : 'Author',
			type        : InputTypes.hidden,
			placeholder : 'Author',
			default     : ''
		})
	});
	var o = {};
	test.equal(Project, o, 'Likely to be different');
});

