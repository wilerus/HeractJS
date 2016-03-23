/**
 * Developer: Ksenia Kartvelishvili
 * Date: 20.11.2015
 * Copyright: 2009-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, require, Handlebars, Backbone, Marionette, $, _, Localizer, Promise */

define(['coreui', './toastNotification/views/InfoToastNotificationView', './toastNotification/views/ErrorToastNotificationView'],
    function (core, InfoToastNotificationView, ErrorToastNotificationView) {
        'use strict';

        var state = {};

        var notificationTypes = {
            INFO: "Info",
            ERROR: "Error"
        };

        return {
            initialize: function (options) {
                core.utils.helpers.ensureOption(options, 'toastNotificationRegion');
                core.utils.helpers.ensureOption(options, 'toastNotificationRegionEl');

                state.toastNotificationRegion = options.toastNotificationRegion;
                state.toastNotificationRegionEl = options.toastNotificationRegionEl;
            },

            add: function (message, type) {
                if (!message) {
                    return;
                }
                type = type || notificationTypes.INFO;

                var notificationView;
                switch (type) {
                case notificationTypes.ERROR:
                    notificationView = new ErrorToastNotificationView({
                        model: new Backbone.Model({
                            text: message
                        })
                    });
                    break;
                default:
                    notificationView = new InfoToastNotificationView({
                        model: new Backbone.Model({
                            text: message
                        })
                    });
                }
                state.toastNotificationRegion.show(notificationView);

                state.toastNotificationRegionEl.show();
                _.delay(function () {
                    state.toastNotificationRegionEl.fadeOut({
                        duration: 1000
                    });
                }, 2000);
            },

            notificationTypes: notificationTypes
        };
    });
