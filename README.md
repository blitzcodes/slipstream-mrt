# Slipstream [![Build Status](https://travis-ci.org/kneath/kss.png)](https://travis-ci.org/blitzcodes/slipstream-mrt)

Slipstream is a [Meteorite](https://github.com/oortcloud/meteorite) package, offering a light weight class interface for [Meteor](http://meteor.com/) development; a handy and organized way to ride the slipstream of the great and evolving Meteor framework. My mission with this project is to address a few key concerns with developing a solid production ready system for Meteor.

* [Mrt Package](https://github.com/blitzcodes/slipstream-mrt)
* Sample Meteor & Meteorite Project - coming soon!

`NOTE:` This project employs the use of Meteorite, a vital tool for any prospective Meteor developer.

## This projects objectives are:

* To provide a pseudo-MV(C/P/VM) like framework, built right on top of the Meteor native library itself
* To help put a structure surrounding the Mongodb, and ensure you're only utilizing columns you have clearly defined vs. just winging it
* To make Meteor much more accessible and easier to use from the get go, without having to remember or access Meteors innards all the time
* To turn the main support classes into a Meteorite package to easily be installed and accessible to any project on a whim
* (Future) To offer a script generator of some kind to automatically create the needs files for new objects from Slipstream

# Interface Objects (At present)
* `Slipstream.Drift` - The main holder object, that is used to access all functions, a quasi-MVC all in one object, to help contain and offer quick access to it's components
* `Slipstream.Collection` - Inheriting and extending the Meteor collection object, as well as many handle attributes and methods to leverage
* `Slipstream.Column` - A field object class used to help control the aspects of each column, controlled directly by the List
* `Slipstream.Method` - Wrapper to handle Meteor method request to help control default calls back to the server for things such as form submission of the Model like object
* `Slipstream.Router` - Leveraging the Router package installable through Meteorite, this handy class preconfigures all of the defaults route you would expect for the given object's name, as well as specificed by you the reference field that would appear in the url, such as /project/:_id/Update, controlled easily through code. No more setting up the basics ever again
* `Slipstream.Template` - Managing all of the template related general activity, such as the default templates to use per object, and form submission

# Why Would An Interface Be Needed?
I'm certainly not the first person who has ran into the constant confusion from lack of structure present in the framework as it stands. The features are brilliant to know end, and I have the up most esteem for the creators and of all their continued hard tireless work on it.  When it comes to its ease and accessibility while designing a DRY or enterprise level applications however, it can be very very tricky to utilize.

Being able to load files from anywhere in a very particular order makes it tough at first to knowing if you're loading things properly, or being lazy and just throwing things all over the place can quickly turn your project into a spaghetti nightmare! The questions as well sa to what code should be what's server side/client side sometimes can make it hard to know which aspects are needed for each respectively.

Coupled with inconsistency of examples out there on how best to leverage and take advantage of the features Meteor has to offer, it's far to easy to fall down the rabbits hole.  Try then to consider working in a team or production environment in that situation, and you can start to see how it's quite like walking through a mine field, blind folded, and backwards... ehh you get the hint!

When you can build your project in such a way, that not only when you return to working on it after a few weeks or months, or have another developer begin to collaborate with you, clean and definitive is code sitting there waiting for you is a godsend! :D

In addition to this, the amount of heavy lifting a interface can afford from the get go, allowing the capabilities to override essential components when further customize as needed, it brings the right balance of efficiency and flexibility while resting on a solid dependable foundation.

# Versions
### 0.0.9
* Much testing and refactoring of the slipstream objects has been applied, cleaning up parts, commenting a little, and flushing out all of the recent changes and essential component functionality/processing
* Restoring proper route initialization, which went slightly astray in the last version
#### Client Side Logging
* Revised the logging controls, to better leverage displaying messages back to the user via bootstraps alerts
** `Slipstream.log.error(message)` - Red
** `Slipstream.log.success(message)` - Green
** `Slipstream.log.warning(message)` - Yellow
** `Slipstream.log.info(message)` - Blue
#### Debugging
* Added a convenient way to toggle which console/server debug message form the end slipstream object, now leveraging the `Meteor._debug` call, vs having random debug message for testing anywhere/anytime...
 ```
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
 ```
#### Now Supporting Pub/Sub
* Added the proper pub/sub configuration to the `Slipstream.Collection`, now by default setting up a pub/sub from the object name, or allowing a object list of publish functions, and named array list of subscribes
* This allowed finally the removal of insecure/autopublish default packages for proper app development.
* The set up code for this got large and fugly, so I moved it into it's own object `Slipstream.CollectionSetup`
* `Slipstream.CollectionSetup` passes back different a different collection based on whether the client or server is running the code, since they have a different order in which they can run publish/subscribe
* In summery, it takes out the grunt work of using them now, either effortlessly by default now declaring nothing, or easily passing along custom calls as needed.

### 0.0.8
* Much testing and practical consideration into how best to define and interact with the core slipstream objects.
* Pulling out as much code from the meteor project to be DRY and reuseable/overrideable within the slipstream objects, giving a solid set of default functionality while still allowing the innards to be easily overrode.

### 0.0.7
* First public version shared.
