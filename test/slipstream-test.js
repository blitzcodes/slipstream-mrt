/**
 * WIP, currently broken till I learn more on the subject
 */

Tinytest.add('MeteorFile - read', function (test) {
	test.equal(1, 1, 'Expected values to be equal');
});

Tinytest.add('Slipstream.Drift - create object', function (test) {
	// Set up filter types and their mongo db selectors
	filter_selections = {
		all       : {},
		active    : {completed : false},
		completed : {completed : true}
	};

	// Returns an event_map key for attaching "ok/cancel" events to
	// a text input (given by selector)

	okcancel_events = function (selector) {
		return 'keyup ' + selector + ', keydown ' + selector + ', focusout ' + selector;
	};

	make_okcancel_handler = function (options) {
		var ok = options.ok || function () {};
		var cancel = options.cancel || function () {};

		return function (evt) {
			if (evt.type === 'keydown' && evt.which === 27) {
				// escape = cancel
				cancel.call(this, evt);

			}
			else if (evt.type === 'keyup' && evt.which === 13 ||
				evt.type === 'focusout') {
				// blur/return/enter = ok/submit if non-empty
				var value = String(evt.target.value || '');
				if (value) {
					ok.call(this, value, evt);
				}
				else {
					cancel.call(this, evt);
				}
			}
		};
	};

	TodoAppEvents = {};
	TodosUpdateEvents = {};

	TodoAppEvents[okcancel_events('#new-todo')] = make_okcancel_handler({
		ok : function (title, evt) {
			Todos.insert({title : $.trim(title), completed : false,
				created_at      : new Date().getTime()});
			evt.target.value = '';
		}
	});

	TodosUpdateEvents[okcancel_events('li.editing input.edit')] = make_okcancel_handler({
		ok     : function (value) {
			Session.set('editing_todo', null);
			Todos.update(this._id, {$set : {title : $.trim(value)}});
		},
		cancel : function () {
			Session.set('editing_todo', null);
			Todos.remove(this._id);
		}
	});

	var todosVoidCount = function (completed) {
		if (_.isUndefined(completed))
			completed = false;
		return Todos.find({completed : completed}).count();
	};

	Todos = Slipstream.Drift({
		name      : 'todos',
		options   : {
			requireUserId : false,
			scaffolding   : false
		},
		templates : {
			app    : {
				helpers : {
					todos : function () {
						return Todos.find().count();
					}
				},
				events  : TodoAppEvents
			},
			update : {
				helpers : {
					todo_completed : function () {
						return this.completed;
					},
					todo_editing   : function () {
						//return Session.equals('editing_todo', this._id);
						// Simplified, leveraging inherent session id, currentTodosId
						return Todos.sessionEquals(this._id);
					}
				},
				events  : _.extend(TodosUpdateEvents, {
					'click input.toggle'   : function () {
						Todos.update(this._id, {$set : {completed : !this.completed}});
					},
					'dblclick label'       : function () {
						//Session.set('editing_todo', this._id);
						// Simplified, leveraging inherent session id, currentTodosId
						Todos.sessionId(this._id);
					},
					'click button.destroy' : function () {
						Todos.remove(this._id);
					}
				})
			},
			list   : {
				helpers : {
					todos               : function () {
						return Todos.find(filter_selections[Session.get('filter')], {sort : {created_at : 1}});
					},
					todos_not_completed : todosVoidCount()
				},
				events  : {
					'click input#toggle-all' : function (evt) {
						var completed = true;
						if (!todosVoidCount) {
							completed = false;
						}
						Todos.find({}).forEach(function (todo) {
							Todos.update({'_id' : todo._id}, {$set : {completed : completed}});
						});
					}
				}
			},
			footer : {
				helpers : {
					todos_completed         : todosVoidCount(true),
					todos_not_completed     : todosVoidCount(),
					todos_one_not_completed : function () {
						return todosVoidCount() == 1;
					},
					filters                 : filters,
					filter_selected         : function (type) {
						return Session.equals('filter', type);
					}
				},
				events  : {
					'click button#clear-completed' : function () {
						Meteor.call('clearCompleted');
					}
				}
			}
		},
		methods   : {
			clearCompleted : function () {
				Todos.remove({completed : true});
			}
		},
		allow     : {
			insert : function () {
				return true;
			},
			update : function () {
				return true;
			},
			remove : function () {
				return true;
			}
		}
	});

	var o = {};
	test.equal(Test, o, 'Likely to be different');
});

