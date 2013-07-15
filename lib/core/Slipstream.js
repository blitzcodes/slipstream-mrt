;
(function () {
    Slipstream = {
        /*
         ### `Slipstream.debugging`
         > Type: Boolean, Default: `true`

         #### Description
         > This parameter allows you to flag a setting globally throughout the Slipstream as to whether or not any debugging console messages should be displayed. In a production setting this should likely be set to `false` to hide all messages.
         > It would also be possible, if you build int some kind of admin level access inside the user accounts, for a production environment to globally set this false simple to any none admin users to non-admin users when configured on the server side. Rough pseudo code `Slipstream.debugging = function() { return !!Meteor.user().isAdmin; }` - a simple function that would return a boolean; using a `!!` helps ensure whatever result we're evaluating is returned to us as boolean no matter what, a very handy little optimization trick.
         */
        debugging: true,
        /*
         ### `Slipstream.debug(message)`
         > Type: Function, Returns: void

         #### Description
         > This function is used to route all debugging messages throughout the Slipstream, and passes it along to the `Meteor._debug(message)` function.  The reason behind this verses simply calling that function itself is simple, to provide the global flag for whether or not any console messages should appear at all, such as for production use.

         #### Parameters
         `message` - String
         > The debugging message tha will be relayed to the console output for you.
         */
        debug: function (message) {
            if (Slipstream.debugging)
                Meteor._debug(message);
        },
        defaults: {},
        error: {},
        log: {},
        Drift: {},
        Config: {},
        Collection: {},
        CollectionSetup: {},
        Column: {},
        Method: {},
        Session: {},
        Router: {},
        TemplateManager: {},
        Template: {}
    };
}());
