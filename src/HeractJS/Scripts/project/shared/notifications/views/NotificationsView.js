define(
    ['./NotificationView'],
    function (NotificationView) {
        'use strict';
        return Marionette.CollectionView.extend({
            childView: NotificationView,

            childEvents: {
                    'dismiss': function (notificationView) {
                        Backbone.Radio.channel('notifications').trigger('dismiss:notification', notificationView.model);
                    },
                    'navigate': function (notificationView) {
                        Backbone.Radio.channel('notifications').trigger('navigate:notification', notificationView);
                    }
                }
        });
    }
);