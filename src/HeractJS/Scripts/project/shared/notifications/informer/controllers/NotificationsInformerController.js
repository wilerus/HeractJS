define(
    ['coreui'],
    function (core) {
        'use strict';

        return Marionette.Object.extend({
            initialize: function () {
                this.__initializeHub();
            },

            __initializeHub: function () {
                var hubManager = window.shared.hubs.HubManager,
                                 COUNT_TYPE = 'count';

                hubManager.SubscribeToHub('inboxHub', function () {
                    var inboxHub = $.connection.inboxHub;
                    inboxHub.server.subscribe();
                }.bind(this));

                hubManager.ReceiveHubUpdates('inboxHub', function (data) {
                    if (data.Type === COUNT_TYPE) {
                        Backbone.Radio.channel('notificationsInformer').trigger('refresh:notificationsCount', data.Count.Count);
                    }
                    Backbone.Radio.channel('notifications').trigger('fetch:notificationsCollection');
                }.bind(this));
            }
        });
    });
