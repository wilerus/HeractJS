define(
    [
        '../templates/notificationsPanel.hbs',
        '../../views/NotificationsView',
        '../../views/NotificationsListEmptyView'
    ],
    function (template, NotificationsView, NotificationsListEmptyView) {
        'use strict';
        return Marionette.LayoutView.extend({
            initialize: function() {
                this.notificationsChannel = Backbone.Radio.channel('notifications');
                this.notificationsChannel.reply('panel:close', this.close, this);
                this.notificationsChannel.on('panel:refresh', this.__refresh, this);
            },

            className: 'notifications-panel',

            template: template,

            regions: {
                notificationsRegion: '.js-notifications'
            },

            ui: {
              deleteAllInobxsItemsButton: '.js-delete-all-inbox-items'  
            },

            events: {
                'click @ui.deleteAllInobxsItemsButton': '__deleteAllInboxItems'
            },

            onRender: function() {
                this.notificationsChannel.request('get:notificationsCollection')
                    .bind(this)
                    .then(function (notificationsCollection) {
                        if (notificationsCollection.length === 0)
                        {
                            this.notificationsRegion.show(new NotificationsListEmptyView({}));
                            return;
                        }
                        this.notificationsRegion.show(new NotificationsView({
                            collection: notificationsCollection
                        }));
                    });
            },

            onBeforeDestroy:function() {
                this.notificationsChannel.stopReplying('panel:close');
            },

            close: function () {
                this.destroy();
            },

            __refresh:function(){
                this.render();
            },

            __deleteAllInboxItems: function () {
                this.notificationsChannel.request('notification:list:delete').bind(this).then(function () {
                    this.__refresh();
                });
            }
        });
    }
);