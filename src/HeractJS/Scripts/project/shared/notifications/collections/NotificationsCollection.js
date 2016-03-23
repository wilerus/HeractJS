define([],
    function () {
        'use strict';
        return Backbone.Collection.extend({
            url: 'api/NotificationsApi',

            clearCollection: function () {
                 return Ajax.Notifications.DeleteAllInboxItems().bind(this).then(function () {
                    this.reset();
                });
            }
        });
    }
);