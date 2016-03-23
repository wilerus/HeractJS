define(
    [
        './informer/views/NotificationsButtonView',
        './informer/views/NotificationsPanelView',
        './informer/controllers/NotificationsInformerController',
        './controllers/NotificationsController'
    ],
    function (
        NotificationsButtonView,
        NotificationsPanelView,
        NotificationsInformerController,
        NotificationsController
        ) {
        'use strict';

        return {
            views: {
                NotificationsButtonView: NotificationsButtonView,
                NotificationsPanelView: NotificationsPanelView
            },
            controllers: {
                NotificationsController: NotificationsController,
                NotificationsInformerController: NotificationsInformerController
            }
        };
    }
);