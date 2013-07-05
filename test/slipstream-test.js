/**
 * WIP, currently broken till I learn more on the subject
 */

Tinytest.add('MeteorFile - read', function (test) {
	test.equal(1, 1, 'Expected values to be equal');
});

Tinytest.add('Slipstream.Drift - create object', function (test) {
	var Project = Slipstream.Drift({
		name            : 'project',
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
		templates       : {
			custom : {
				helpers   : {
					items : function () {
						return Project.find({}, {sort : {dateCreated : -1}});
					}
				},
				events    : {
				},
				created   : function () {
				},
				rendered  : function () {
				},
				destroyed : function () {
				}
			}
		}});
	var o = {};
	test.equal(Project, o, 'Likely to be different');
});

