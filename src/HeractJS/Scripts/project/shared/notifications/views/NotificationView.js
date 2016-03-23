define(
    ['coreui', '../templates/notification.hbs'],
    function(core, template) {
        'use strict';
        return Marionette.ItemView.extend({
            className: function() {
                return 'notification-i' + (this.model.get('isRead') ? ' notification-i_read' : ' notification-i_unread');
            },

            template: template,

            templateHelpers: function() {
                return {
                    type: this.model.get('systemType').split('.').splice(-1, 1)[0],

                    isNotTask: function() {
                        return this.type != 'UserTask';
                    },

                    icon: function() {
                        switch (this.type) {
                            case 'Conversation':
                                return 'userTask';
                            case 'UserTask':
                                return 'userTask';
                            default:
                                return 'icon';
                        }
                    },

                    lastCommentTime: function() {
                        return moment(this.date).fromNow();
                    },

                    haveNewComments: function () {
                        if (this.newCommentsCount !== 0) {
                            return true;
                        }
                    },

                    newComments: function() {
                        if (this.type == 'UserTask') {
                            return '';
                        }

                        switch (this.newCommentsCount) {
                            case 1:
                                return Localizer.get('PROCESS.COMMON.NOTIFICATIONS.NOTIFICATION.NEWCOMMENT');
                            default:
                                return this.newCommentsCount + ' ' + core.utils.helpers.getPluralForm(this.newCommentsCount, Localizer.get('PROCESS.COMMON.NOTIFICATIONS.NOTIFICATION.NEWCOMMENTS.PLURALFORM'));
                        }
                    },

                    isObjectFollowed: function () {
                        return this.isFollowed;
                    }
                }
            },

            triggers: {
                'click .js-dismiss': 'dismiss'
            },

            ui: {
                unfollowButton: '.js-unfollow'
            },

            events: {
                'click @ui.unfollowButton': '__unfollow',
                'click':'__navigate'
            },

            __unfollow: function (e) {
                if (!e) {
                    window.event.cancelBubble = true;
                } else if (e.stopPropagation) {
                    e.stopPropagation();
                }

                Promise.resolve(Backbone.Radio.channel('notifications').request('unfollow:notification', this.model)).bind(this)
                    .then(function () {
                        this.render();
                });
            },

            __navigate: function () {
                this.triggerMethod('navigate');
            }
        });
    }
);