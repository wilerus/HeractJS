/**
 * Developer: Roman Shumskiy
 * Date: 01/10/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, _ */

define(['form/App', 'form/templates/widgets/duration.hbs'],
    function (App, itemTmpl) {
        'use strict';
        return Marionette.ItemView.extend({
            initialize: function () {
                _.bindAll(this, "template");
            },
            ui: {
                input: '.js-input'
            },
            className: '',
            template: itemTmpl,
            onRender: function(){
                this.$el.addClass(this.className);
                this.setValue();
            },
            setValue: function(){
                var value = this.getTime();
                this.ui.input.val(value || '');
            },
            getTime: function () {
                var duration = moment.duration(this.model.get('dataValue'));
                return App.DateFormatter.getDurationString(duration); //do not use moments method days() cause it's returns value (duration._days % 30)
            }
        });
    });
