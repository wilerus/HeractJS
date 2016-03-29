/**
 * Developer: Alexander Makarov
 * Date: 08.07.2015
 * Copyright: 2009-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, require, Handlebars, Backbone, Marionette, $, _, Localizer */

define([
        'comindware/core',
        '../templates/group.hbs'
    ],
    function (core, template) {
        'use strict';

        var classes = {
            selected: 'selected'
        };

        return Marionette.ItemView.extend({

            template: template,

            tagName: 'li',

            onRender: function () {
                this.$el.toggleClass(classes.selected, !!this.model.selected);
            },

            className: 'demo-groups__li'
        });
    });
