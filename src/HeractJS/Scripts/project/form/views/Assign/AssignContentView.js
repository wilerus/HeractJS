/**
 * Developer: Daniil Korolev
 * Date: 12/03/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, _ */

define(['../../App', '../../templates/popups/assignPopup/assignContent.html'],
    function (App, contentTmpl) {
        'use strict';
        return Marionette.ItemView.extend({
            initialize: function () {
                _.bindAll(this, "template");
            },
            template: Handlebars.compile(contentTmpl),
            events: {
            }
        });
    });
