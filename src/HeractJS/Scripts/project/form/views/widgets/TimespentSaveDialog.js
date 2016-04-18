/**
 * Developer: Grigory Kuznetsov
 * Date: 11/11/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define */

define(['form/App', 'form/templates/widgets/timespentSaveDialog.html'],
    function (App, timespentSaveDialogTmpl) {
        'use strict';

        return Marionette.ItemView.extend({
            tagName: 'div',
            className: 'wmodal',
            template: Handlebars.compile(timespentSaveDialogTmpl),
            ui: {
                timespentCancelBtn: '#timespentCancelBtn',
                timespentSaveBtn: '#timespentSaveBtn'
            },
            events: {
                'click @ui.timespentCancelBtn': 'onCancelClick',
                'click @ui.timespentSaveBtn': 'onSaveBtnClick'
            },
            initialize: function (opts) {
                this.data = opts.data;
            },
            onCancelClick: function () {
                App.FormMediator.showCurrentItemTimespent();
                App.FormMediator.hideCustomPopupView('hideCustomPopupView');
            },
            onSaveBtnClick: function () {
                this.model.set(this.data);
                this.model.edit();
            }
        });
    });
