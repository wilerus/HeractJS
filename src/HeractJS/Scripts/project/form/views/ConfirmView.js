/**
 * Developer: Roman Shumskiy
 * Date: 15/10/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define */

define(['form/App', 'form/templates/confirm.html'],
    function (App, itemTmpl) {
        'use strict';
        return Marionette.ItemView.extend({
            initialize: function (options) {
                this.templateInfo = {
                    title: options.title ? options.title : App.Localizer.get('ELEGANCE.FORM.CONFIRM.DEFAULTTITLE'),
                    textContent: options.text ? options.text : App.Localizer.get('ELEGANCE.FORM.CONFIRM.DEFAULT'),
                    textOk: options.textOk ? options.textOk : App.Localizer.get('ELEGANCE.FORM.CONFIRM.OK'),
                    textCancel: options.textCancel ? options.textCancel : App.Localizer.get('ELEGANCE.FORM.CONFIRM.CANCEL')
                };

                this.template = function(){
                    var template =  Handlebars.compile(itemTmpl);
                    return template(this.templateInfo);
                }.bind(this);

            },
            className: 'wmodal',
            events: {
                'click #confirm-btn-ok': 'triggerOk',
                'click #confirm-btn-cancel': 'triggerCancel'
            },
            onRender: function(){
                this.$el.addClass(this.className);
            },
            triggerOk: function(){
                this.trigger('triggerOk');
            },
            triggerCancel: function(){
                this.trigger('triggerCancel');
            }
        });
    });
