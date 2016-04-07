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

define(['../../../App', '../../../templates/editors/attachments/selectOption.html'],
    function (App, itemTemplate) {
        'use strict';
        return Marionette.ItemView.extend({
            initialize: function () {
                _.bindAll(this, "template");
            },

            events: {
                'click .js-back': 'onBack',
                'click .js-update': 'onUpdate',
                'click .js-rename': 'onRename'
            },

            template: Handlebars.compile(itemTemplate),
            className: 'wmodal ',

            onBack: function(){
                this.trigger('backClicked');
            },

            onUpdate: function(){
                this.trigger('updateClicked');
            },

            onRename: function(){

            }
        });
    });
