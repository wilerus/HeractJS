/**
 * Developer: Grigory Kuznetsov
 * Date: 13/11/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, _ */

define(['form/App', 'form/templates/widgets/customTab.html'],
    function (App, tmpl) {
        'use strict';

        return Marionette.ItemView.extend({
            className: 'card__i',
            template: Handlebars.compile(tmpl),
            events: {
                'click': 'openTab'
            },
            initialize: function (opts) {
                this.mode = opts.mode;
                this.isEdit = opts.isEdit;
                this.isCreate = opts.isCreate;
                this.setHiddenClassNameIfNeeded();
                _.bindAll(this, "template");
                this.render();
            },
            setHiddenClassNameIfNeeded: function () {
                this.isVisible = this.model.get('isVisible');
                !this.isVisible && (this.className += ' hidden');
            },
            onRender: function () {
                this.model.get('isContainRequiredFields') && (this.mode || this.isEdit || this.isCreate) && this.$el.addClass('tab-requiered');
                this.model.get('isContainValidationError') && this.$el.addClass('tab-invalid');
                !this.model.get('hasChildren') && this.$el.addClass('field-inactive');

                this.$el.addClass(this.className);
                this.$el.attr('component-id', this.model.get('id'));
            },
            openTab: function () {
                if(this.model.get('hasChildren')){
                    App.FormMediator.updateItem(false, {
                        fieldId: this.model.get('id'),
                        type: 'customTab',
                        mode: this.mode,
                        isEdit: this.isEdit,
                        isCreate: this.isCreate,
                        isCustomTab: true
                    });
                }
            }
        });
    });
