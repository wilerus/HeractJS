/**
 * Developer: Grgigory Kuznetsov
 * Date: 27/11/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, Backbone */

define(['form/templates/widgets/widgetComposite.html',
        './SingleLineText',
        './Instance',
        './Account',
        './DateTime',
        './Duration',
        './ListOfValues',
        './Boolean'],
    function (compositeTemplate, SingleLineText, InstanceView, AccountView, DateTimeView, Duration, ListOfValuesView, Boolean) {
        'use strict';
        return Marionette.CompositeView.extend({
            template: Handlebars.compile(compositeTemplate, {noEscape: true}),
            childViewContainer: '.js-values',
            className: 'card__i',
            invalidClass: 'tab-invalid',
            initialize: function () {
                this.access = this.model.get('access');
                this.setHiddenClassNameIfNeeded();
                this.isHasValidationError = this.model.get('isHasValidationError');
                this.widgetType = this.model.get('widgetType');
                this.createCollection();
                this.render();
            },

            setHiddenClassNameIfNeeded: function () {
                this.isVisible = this.model.get('isVisible');
                !this.isVisible && (this.className += ' hidden');
            },

            getChildView: function () {
                var view;

                if (this.widgetType === 'Instance') {
                    view = InstanceView;
                } else if (this.widgetType === 'Account') {
                    view = AccountView;
                } else if (this.widgetType === 'DateTime' || this.widgetType === 'Date') {
                    view = DateTimeView;
                } else if (this.widgetType === 'Duration') {
                    view = Duration;
                } else if (this.widgetType === 'Selector') {
                    view = ListOfValuesView;
                } else if (this.widgetType === 'Boolean') {
                    view = Boolean;
                } else {
                    view = SingleLineText;
                }

                return view;
            },
            createCollection: function () {
                var values;

                if (this.widgetType === 'Instance' || this.widgetType === 'Account' || this.widgetType === 'Selector') {
                    values = this.model.get('instances');
                } else if (this.widgetType === 'Boolean') {
                    values = [{dataValue: this.model.get('dataValue')}];
                } else {
                    values = this.model.get('dataValue');
                }

                this.collection = new Backbone.Collection(values);
            },
            childViewOptions: function () {
                if (this.widgetType === 'Instance') {
                    var dataId = this.model.get('dataId'),
                        isNotInstance = this.notInstances[dataId];
                    return {generalModel: this.model, isNotInstance: isNotInstance};
                } else {
                    return {generalModel: this.model};
                }
            },
            notInstances: {
                itemGroup: true,
                taskStatus: true,
                workflowState: true,
                userType: true,
                systemType: true
            },
            mixinTemplateHelpers: function (data) {
                data.isDisabled = this.access === 'Hidden';
                return data;
            },
            onRender: function () {
                this.$el.addClass(this.className);
                this.isHasValidationError && this.$el.addClass(this.invalidClass);
                this.$el.attr('data-editors', this.model.get('dataId'));
                if (this.model.get('dataId') === 'title') {
                    this.$el.addClass('card__i_title');
                }
            }
        });
    });
