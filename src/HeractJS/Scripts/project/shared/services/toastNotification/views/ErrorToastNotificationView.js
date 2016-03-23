/**
 * Developer: Ksenia Kartvelishvili
 * Date: 23.11.2015
 * Copyright: 2009-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, require, Handlebars, Backbone, Marionette, $, _, Localizer, Promise */

define(['../templates/errorToastNotification.hbs'],
    function (template) {
        'use strict';
        return Marionette.ItemView.extend({
            className: "fr-block fr-alert fr-alert_error",

            template: template
        });
    });
