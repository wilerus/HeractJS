define(
    [
        'coreui',
        '../templates/notificationsButton.hbs'
    ],
    function (core, template) {
        'use strict';
        return Marionette.ItemView.extend({
            behaviors: {
                CustomAnchorBehavior: {
                    behaviorClass: core.dropdown.views.behaviors.CustomAnchorBehavior,
                    anchor: '.js-anchor'
                }
            },

            template: template,

            templateHelpers: function() {
                return {
                    notificationsCount: (this.notificationsCount < 99) ? this.notificationsCount : '99+'
                };
            },

            initialize: function () {
                this.notificationsInformerChannel = Backbone.Radio.channel('notificationsInformer');
                var notificationsChannel = Backbone.Radio.channel('notifications');

                notificationsChannel.request('get:notificationsCount')
                    .bind(this)
                    .then(function(data) {
                        this.__refreshNotificationsCount(data);
                    });

                this.notificationsInformerChannel.on('refresh:notificationsCount', this.__refreshNotificationsCount, this);
            },

            notificationsCount: 0,

            __refreshNotificationsCount: function (notificationsCount) {
                this.notificationsCount = notificationsCount;
                this.render();
            },

            onBeforeDestroy: function () {
                this.stopListening(this.notificationsInformerChannel, 'refresh:notificationsCount');
            }
        });
    }
);