;
(function () {
	//	debug("Slipstream.Template");
	var getTemplate = function (type) {
		return Template[name + type];
	};

	var TemplateProto = {
		/***************************
		 TEMPLATE Attributes & Methods
		 ****************************/
		template  : function (type) {
			return getTemplate(type);
		},
		templates : {
			List   : getTemplate('List'),
			View   : getTemplate('View'),
			Create : getTemplate('Create'),
			Update : getTemplate('Update'),
			Delete : getTemplate('Delete')
		},

		call                   : function (m, d, c) {
			Meteor.call(m, d, c);
		},
		loadValuesFromTemplate : function (t) {
			var data = {};
			_.each(this.columns, function (element, index, list) {
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

			var data = list.loadValuesFromTemplate(t);

			//				debug("My name is " + name);

			Meteor.call(name, data, function (err, id) {
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
	};
	Slipstream.Template = function (options) {
		return _.extend(Object.create(TemplateProto), Slipstream.Render(options));
	};

	//	Slipstream.Template = function (name, list) {
	//		var getTemplate = function (type) {
	//			return Template[name + type];
	//		};
	//
	//		var self = {
	//			/***************************
	//			 TEMPLATE Attributes & Methods
	//			 ****************************/
	//			template  : function (type) {
	//				return Template[this.name + type];
	//			},
	//			templates : {
	//				List   : getTemplate('List'),
	//				View   : getTemplate('View'),
	//				Create : getTemplate('Create'),
	//				Update : getTemplate('Update'),
	//				Delete : getTemplate('Delete')
	//			},
	//
	//			call       : function (m, d, c) { // expected as 'method' {data} callback(), yet allow any combination to be used
	//				//				var method,
	//				//					data,
	//				//					callback;
	//				//
	//				//				// gracefully retrieve the functions arguments, to see if they correspond to the needed types
	//				//				_.each(arguments, function (element, index, list) { // this referring to one of the filed names in the columnNames array
	//				//					switch (typeof element) {
	//				//						case 'string':
	//				//							method = element;
	//				//							break;
	//				//						case 'function':
	//				//							callback = element;
	//				//							break;
	//				//						case 'object':
	//				//						case 'array':
	//				//							data = element;
	//				//							break;
	//				//					}
	//				//				});
	//				//
	//				//				// even though this is the first argument, for default crud calls, the slipstream can assume the default named method
	//				//				if (!method)
	//				//					method = this.name;
	//				//
	//				//				Meteor.call(method, data, callback);
	//
	//				Meteor.call(m, d, c);
	//			},
	//			submitForm : function (e, t) {
	//				e.preventDefault();
	//
	//				var data = list.loadValuesFromTemplate(t);
	//
	////				debug("My name is " + name);
	//
	//				Meteor.call(name, data, function (err, id) {
	//					if (err) {
	//						displayError(err.error + " : " + err.reason); // display the error to the user
	//
	//						if (err.error === 302) // if the error is that the post already exists, take us there
	//							;//Meteor.Router.to('postPage', error.details)
	//					}
	//					else {
	//						//Meteor.Router.to('postPage', id);
	//					}
	//				});
	//			}
	//		};
	//
	//		return self;
	//	};
}());
