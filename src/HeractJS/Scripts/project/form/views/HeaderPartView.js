/**
 * Developer: Roman Shumskiy
 * Date: 10/10/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, _ */

define(['../App', '../templates/headerPart.html'],
    function (App, headTmpl) {
        'use strict';
        return Marionette.LayoutView.extend({
            initialize: function (options) {
                var Model = Backbone.Model.extend({});
                this.model = new Model({text: options.text});
                _.bindAll(this, "template");
            },

            template: Handlebars.compile(headTmpl),

            regions: {
            },

            className: 'btn-txt',

            attributes: {
                'tabindex': 0
            },

            events: {
                'click': 'throwClick'
            },

            throwClick: function(){
                this.trigger('sectionClicked');
            }
        });
    });
