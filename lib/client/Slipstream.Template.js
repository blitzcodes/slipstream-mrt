;
(function () {
	//	debug("Slipstream.Template");

	Slipstream.Template = function (col, options) {
		var getTemplate = function (type) {
			return Template[options.name + type.ucwords()];
		}, self = Object.create({
			/***************************
			 TEMPLATE Attributes & Methods
			 ****************************/
			template               : function (type) {
				return getTemplate(type);
				//			debug("my name is " + this.name);
				//			return Template[this.name + type.ucwords()];
			},
			templates              : {
				//				List   : function () { return getTemplate('List'); },
				//				View   : function () { return getTemplate('View'); },
				//				Create : function () { return getTemplate('Create'); },
				//				Update : function () { return getTemplate('Update'); },
				//				Delete : function () { return getTemplate('Delete'); }
				//
				List   : getTemplate('List'),
				View   : getTemplate('View'),
				Create : getTemplate('Create'),
				Update : getTemplate('Update'),
				Delete : getTemplate('Delete')
			},
			loadValuesFromTemplate : function (t) {
				var data = {};
				_.each(col.columns, function (element, index, list) {
					var found = t.find("#" + element.name);
					if (found)
						data[element.name] = found.value;
					//						else
					//							data[element.name] = element.default;
				});
				return data;
			},
			submitForm             : function (e, t) {
				e.preventDefault();

				var data = self.loadValuesFromTemplate(t);

								debug("submitForm, My name is " + options.name);

				Meteor.call(options.name, data, function (err, id) {
					if (err) {
						displayError(err.error + " : " + err.reason); // display the error to the user

						if (err.error === 302) // if the error is that the post already exists, take us there
							;//Meteor.Router.to('postPage', error.details)
					}
					else {
						//Meteor.Router.to('postPage', id);
					}
				});
			}
		});

		return self;
	};
}());
