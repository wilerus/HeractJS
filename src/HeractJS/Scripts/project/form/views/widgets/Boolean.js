/**
 * Developer: Grigory Kuznetsov
 * Date: 17/02/2015
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */


define(['../../App'],
    function (App) {
        'use strict';
        return Marionette.ItemView.extend({
            initialize: function (opts) {
                this.generalModel = opts.generalModel;
                this.setValue();
            },

            template: Handlebars.compile('{{dataValue}}'),

            setValue: function () {
                this.realValue = this.generalModel.get('dataValue');
                if (this.realValue === true) {
                    this.displayValue = App.Localizer.get('ELEGANCE.FORM.WIDGETS.BOOLEAN.TRUEVALUE');
                } else if (this.realValue === false) {
                    this.displayValue = App.Localizer.get('ELEGANCE.FORM.WIDGETS.BOOLEAN.FALSEVALUE');
                } else {
                    this.displayValue = App.Localizer.get('ELEGANCE.FORM.WIDGETS.BOOLEAN.NOTSET');
                }
            },

            mixinTemplateHelpers: function (data) {
                if (this.generalModel.get('access') === 'Hidden')
                    return;

                data.dataValue = this.displayValue;
                return data;
            }
        });
    });
