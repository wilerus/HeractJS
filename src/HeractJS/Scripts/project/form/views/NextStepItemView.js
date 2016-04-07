/**
 * Developer: Roman Shumskiy
 * Date: 17/10/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, _ */

define(['../templates/nextStepItem.html'],
    function (itemTmpl) {
        'use strict';
        return Marionette.ItemView.extend({
            initialize: function () {
                _.bindAll(this, "template");
            },
            template: Handlebars.compile(itemTmpl),
            className: 'list__i',
            events: {
                'click': 'itemSelected'
            },

            onRender: function(){
                this.$el.addClass(this.className);
            },

            itemSelected: function(){
                this.trigger('itemSelected');
            }
        });
    });
