define(
    [
        'sharedpath/services/ModuleService',
        'sharedpath/services/RoutingService',
        '../collections/NotificationsCollection'
    ],
    function (ModuleService, RoutingService, NotificationsCollection) {
        'use strict';
        return Marionette.Object.extend({
            initialize: function () {
                this.notificationsCollection = new NotificationsCollection();
                this.__fetchNotificationsCollection();

                Backbone.Radio.channel('notifications').on({
                    'fetch:notificationsCollection': this.__fetchNotificationsCollection,
                    'dismiss:notification': this.__dismiss,
                    'navigate:notification': this.__navigate
                }, this);

                Backbone.Radio.channel('notifications').reply({
                    'get:notificationsCollection': this.__getNotificationsCollection,
                    'get:notificationsCount': this.__getNotificationsCount,
                    'unfollow:notification': this.__unfollow,
                    'notification:list:delete': this.__deleteAllInboxes
                }, this);
            },

            __fetchNotificationsCollection: function() {
                this.notificationsCollectionLoader = this.notificationsCollection.fetch();
            },

            __getNotificationsCollection: function() {
                return this.notificationsCollectionLoader.bind(this).then(function() {
                    return this.notificationsCollection;
                });
            },

            __getNotificationsCount: function() {
                return Ajax.Notifications.GetInboxCount();
            },

            __dismiss: function(notificationModel) {
                Promise.resolve(notificationModel.destroy()).bind(this).then(function () {
                    if (this.notificationsCollection.length === 0) {
                        Backbone.Radio.channel('notifications').trigger('panel:refresh');
                    }
                });
            },

            __getNotificationUrl: function (type, notificationInboxId) {
                switch (type) {
                    case 'Conversation':
                       return Ajax.Notifications.GetNotificationParentId(notificationInboxId).then(function (parentId) {
                           return ModuleService.getModuleUrlByName('task',
                                ModuleService.modules.MYTASKS, { taskId: parentId });
                        });
                        break;
                    case 'UserTask':
                        return ModuleService.getModuleUrlByName('task', ModuleService.modules.MYTASKS, { taskId: notificationInboxId });
                    default:
                        return '/';
                }
            },

            __navigate: function(notificationView) {
                this.__markRead(notificationView);
                this.__clearCommentsCount(notificationView);

                Backbone.Radio.channel('notifications').request('panel:close');
                var type = notificationView.model.get('systemType').split('.').splice(-1, 1)[0];
                if (type !== 'UserTask') {
                    Promise.resolve(this.__getNotificationUrl(type, notificationView.model.get('inboxId'))).then(function (parentId) {
                        RoutingService.navigateToUrl(parentId);
                    });
                } else {
                    RoutingService.navigateToUrl(this.__getNotificationUrl(type, notificationView.model.get('inboxId')));
                }
            },

            __clearCommentsCount: function (notificationView) {
               Ajax.Notifications.ClearNewCommentsCount(notificationView.model.get('inboxId'));
            },

            __markRead: function (notificationView) {
                notificationView.model.save({ isRead: true }, { patch: true });
            },

            __unfollow: function (model) {
                return Ajax.Notifications.Unfollow(model.get('inboxId')).then(function () {
                   return model.save({ isFollowed: false }, { patch: true });
                });
            },

            __deleteAllInboxes: function () {
                return this.notificationsCollection.clearCollection();
            }
        });
    }
);