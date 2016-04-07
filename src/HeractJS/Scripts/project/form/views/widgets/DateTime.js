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

define(['../../App', '../../templates/widgets/dateTime.html'],
    function (App, itemTmpl) {
        'use strict';

        return Marionette.ItemView.extend({
            initialize: function (opts) {
                _.bindAll(this, "template");
                this.generalModel = opts.generalModel;

                this.type = this.generalModel.get('widgetType');
                this.displayFormat = this.generalModel.get('format');
                this.displayValue = App.DateFormatter.getDateWithTrackerFormat(this.model.get('dataValue'), this.displayFormat, this.type);
                this.model.set('dataFormat', 'yyyy/mm/dd hh:ii'); // format doesn't exist in cfg now
            },
            template: Handlebars.compile(itemTmpl),
            onRender: function(){
                this.$el.addClass(this.className);
            },
            mixinTemplateHelpers: function (data) {
                data.dataValue = this.displayValue;
                return data;
            }
        });
    });
