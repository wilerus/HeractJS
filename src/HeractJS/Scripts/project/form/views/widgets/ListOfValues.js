/**
 * Developer: Roman Shumskiy
 * Date: 13/11/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, _ */

define(['form/App'],
    function (App) {
        'use strict';
        return Marionette.ItemView.extend({
            initialize: function () {
                _.bindAll(this, "template");
            },
            className: '',
            template: Handlebars.compile('{{instanceName}}', {noEscape: true}),
            onRender: function(){
                this.$el.addClass(this.className);
            }
        });
    });
