# Slipstream - v0.0.7
A light weight interface for Meteor development; a handy and organized way to ride the slipstream of the great and evolving Meteor framework. My mission with this project is to address a few key concerns with developing a solid production ready system for Meteor.

`NOTE:` This project employs the use of [Meteorite](https://github.com/oortcloud/meteorite), a vital tool for any prospective Meteor developer.

## This projects objectives are:

* To provide a pseudo-MV(C/P/VM) like framework, built right on top of the Meteor native library itself
* To help put a structure surrounding the Mongodb, and ensure you're only utilizing columns you have clearly defined vs. just winging it
* To make Meteor much more accessible and easier to use from the get go, without having to remember or access Meteors innards all the time
* (Future) To offer a script generator of some kind to automatically create the needs files for new objects from Slipstream
* (Future) To turn the main support classes into a Meteorite package to easily be installed and accessible to any project on a whim

# Interface Objects (At present)
* `Slipstream.Drift` - The main holder object, that is used to access all functions, a quasi-MVC all in one object, to help contain and offer quick access to it's components
* `Slipstream.List` - Inheriting and extending the Meteor collection object, as well as many handle attributes and methods to leverage
* `Slipstream.Column` - A field object class used to help control the aspects of each column, controlled directly by the List
* `Slipstream.Method` - Wrapper to handle Meteor method request to help control default calls back to the server for things such as form submission of the Model like object
* `Slipstream.Router` - Leveraging the Router package installable through Meteorite, this handy class preconfigures all of the defaults route you would expect for the given object's name, as well as specificed by you the reference field that would appear in the url, such as /project/:_id/Update, controlled easily through code. No more setting up the basics ever again
* `Slipstream.Template` - Managing all of the template related general activity, such as the default templates to use per object, and form submission

# Why Would An Interface Be Needed?
I'm certainly not the first person who has ran into the constant confusion form lack of structure present in the framework as it stands. The features are brilliant to know end, have the up most esteem for the creators and of all their continued hard tireless work on it.  When it comes to its ease and accessibility when looking to design enterprise level applications however, it can be very very tricky.

Being able to load files from anywhere in a very particular order makes it tough at first to knowing if you're loading things properly, or being lazy and just throwing things all over the place. The question as well of what's server side/client side, when to use what where, sometimes can make it hard to know which aspects are needed for each respectively.

Coupled with inconsistency of examples out there on how best to leverage and take advantage of the features Meteor has to offer, it's far to easy to fall down the rabbits hole.  Try then to consider working in a team or production environment in that situation, and you can start to see how it's quite like walking through a mine field, blind folded, and backwards... ehh you get the hint!

When you can build your project in such a way, that not only when you return to working on it after a few weeks or months, or have another developer begin to collaborate with you, clean and definite code sitting there waiting for you is a godsend! :D

# Notes
While I work on this during my spare time, in the interim leave as WIP full site to showcase it's basic purpose. I hope eventually to allow it to function as a dedicated Meteorite package, but my attempts at this didn't fair well, and it' still a bit beyond me.

Recent changes, I had the Slipstream objects in a single master class, and have started to break them out into their individual concerns, so they can better do what they should be doing well.p
