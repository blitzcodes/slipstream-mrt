/**
 * WIP, currently broken till I learn more on the subject
 */

Tinytest.add('MeteorFile - read', function (test) {
	test.equal(1, 1, 'Expected values to be equal');
});

Tinytest.add('Slipstream.Drift - create object', function (test) {
	var Test = Slipstream.Drift({
		name            : 'test',
		referenceColumn : 'slug',
		columns         : {
			title : Slipstream.Column({
				name        : 'title',
				label       : 'Project Title',
				type        : 'text',
				placeholder : 'Title'
			}),
			desc  : Slipstream.Column({
				name        : 'desc',
				label       : 'Project Description',
				type        : 'textarea',
				placeholder : 'Description'
			})
		},
		// The debug options can be set for any slipsteam object you're working with:
		debug : {
			// This will display any initialization calls that should run only the first time an object is created. This may run in any of the supporting objects, and require their matching debug flags below to be true in order to display. The exception to this is the pub/sub init messages, which only requires this flag.
			init       : true,
			// The rest of the options will display key message when running functions inside the given object:
			collection : true, // Messages related to process collection requests, such attempts to insert/update, etc...
			template   : true, // Messages related to the loading of template actions, largely around he submit form action and results of it's steps
			render     : true, // Messages related to elements being rendered on page, called largely as helper objects for tempaltes
			router     : true, // Messages related to setting up accessing router functions, main fall under the init flags
			session    : true, // Messages related to render session related data as it's accessed
			method : true // Messages related to running the Meteor.methods calls, related to processing the template data for validation before sending it along to the collection for processing there
		}
	});
	var o = {};
	test.equal(Test, o, 'Likely to be different');
});

