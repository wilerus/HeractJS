/**
 * Developer: Peter Volynsky
 * Date: 24.10.13
 * Copyright: 2009-2014 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */
define([
    'shared'
], function(shared) {
    'use strict';
    var counter = 1;

    var ProfileNotificationsModule = Core.Controller.extend({
        helpTopicId: 'PROFILE.NOTIFICATIONS',

        showProfileNotifications: function () {
            var layout = this.contentRegion.el;
            var fid = 'cmw-form-profile-notification-settings-form-' + counter;
            var renderedTemplate = TM.getF('ProfileNotificationSettings')({ id: fid });
            $(layout).empty();
            var renderTo = $("<div/>").addClass("profile").appendTo($(layout))[0];
            $(renderTo).html(renderedTemplate.text);

            var wrap = function (fname, cls) {
                counter++;
                var id = 'notifiction_settings_' + cls + counter;
                $(layout).find('.' + cls)[0].id = id;
                $(layout).find('.' + cls + '_Label').attr('for', id);
                return {
                    templateName: 'Switch',
                    name: fname,
                    id: id
                };
            };

            counter++;
            var selectid = 'notifiction_settings_taskUpdatesAssignmentOnly' + counter;
            $(layout).find('.taskUpdatesAssignmentOnly')[0].id = selectid;
            var select = {
                templateName: 'Select',
                name: 'SendTaskUpdatesAssignedOnly',
                id: selectid,
                selectList: [{ Value: false, Text: Localizer.get('PROJECT.PROFILE.NOTIFICATIONSTAB.TASKUPDATES.ALLUPDATES') }, { Value: true, Text: Localizer.get('PROJECT.PROFILE.NOTIFICATIONSTAB.TASKUPDATES.ASSIGNMENTSONLY') }],
                allowBlank: false,
            };

            var cfg = [
                wrap('SendDailySummary', 'dailySummary'),
                wrap('SendTaskUpdates', 'taskUpdates'),
                wrap('SendDocumentUpdates', 'documentUpdates'),
                wrap('SendAwardUpdates', 'awardUpdates'),
                wrap('SendDiscussionUpdates', 'discussionUpdates'),
                wrap('SendTimesheetUpdates', 'timesheetUpdates'),
                wrap('SendRoomUpdates', 'roomUpdates'),
                wrap('SendProjectUpdates', 'projectUpdates'),
                select
            ];

            var formEl = $(layout).find('.notification_settings_form');
            var loading = $(layout).find(".notification_settings_loading");
            var noServer = $(layout).find(".notification_settings_noserver");

            var formController = js.widget.form.cmwForm({
                autoSubmit: true,
                id: fid,
                name: 'notification_settings_form',
                listeners: {
                    submitChanges: function (changes, successCallback, errorCallback) {
                        Ajax.Profile.EditNotificationSettings(this.getData(), { success: successCallback, error: errorCallback });
                    },
                    "SendTaskUpdates>change": function (input) {
                        var SendTaskUpdatesAssignedOnly = this.getElementByName("SendTaskUpdatesAssignedOnly");
                        SendTaskUpdatesAssignedOnly[input.getValue() ? "enable" : "disable"]();
                    }
                },
                properties: cfg
            });

            loading.show();
            Ajax.Profile.GetNotificationSettings({
                success: function (data) {
                    loading.hide();
                    if (data.success) {
                        if (data.data == false) {
                            noServer.show();
                            formEl.hide();
                        } else {
                            formEl.show();
                            JS.each(data.data, function (key, value) { formController.getElementByName(key).setValue(value); });
                        }
                    }
                    formController.fixState();
                },
                ownHandler: true,
                dataType: 'json'
            });
        }
    });

    return ProfileNotificationsModule;
});