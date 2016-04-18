/**
 * Developer: Grigory Kuznetsov
 * Date: 7/11/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define */

define(['form/App', 'form/templates/widgets/timespentItem.html',
        'form/templates/widgets/timespentCollection.html', 'form/templates/widgets/timeSpentItemNew.html'],
    function (App, TimespentItemTmpl, TimespentCollectionTmpl) {
        'use strict';

        var TimespentItemView = Marionette.ItemView.extend({
            template: Handlebars.compile(TimespentItemTmpl),
            tagName: 'div',
            className: 'tab-list__i',
            ui: {
                description: '.js-description'
            },
            events: {
                'click': 'onClick'
            },
            onClick: function () {
                this.canEdit && App.FormMediator.updateItem(false, {
                    fieldId: this.model.get('id'),
                    type: 'singleTimespent'
                });
            },
            mixinTemplateHelpers: function (data) {
                data.loggedTimeText = App.DateFormatter.getDurationString(moment.duration(this.model.get('timeSpent')));
                data.recordDate = App.DateFormatter.getFullDate(data.date);
                data.author = this.model.get('subjectAccount');
                return data;
            },
            initialize: function (opts) {
                this.editEnabled = opts.editEnabled;
                this.canEdit = this.editEnabled && App.currentParameters.id === this.model.get('subjectAccount').id;
            },
            onRender: function () {
                if (this.canEdit) {
                    this.$el.find('.tab-list__desc-ts').addClass('icon-arrow-r');
                }

                var description = this.model.get('description');
                description = description ? description.replace(/\n/g, '<br>') : '';

                this.ui.description.html(description);
            }
        });

        return Marionette.CompositeView.extend({
            className: 'tab-list',
            template: Handlebars.compile(TimespentCollectionTmpl),
            childView: TimespentItemView,
            childViewContainer: '.js-timespent-collection',
            initialize: function (options) {
                this.collection = this.model.recordCollection;
                this.editEnabled = options.editEnabled;
            },

            childViewOptions: function (model) {
                return {model: model, editEnabled: this.editEnabled};
            },

            mixinTemplateHelpers: function (data) {
                data.currentTaskTimeText = this.getCurrentTaskTime();
                data.currentSubtaskTimeText = this.getSubtaskTimeText();

                return data;
            },

            getSubtaskTimeText: function () {
                var duration = moment.duration(this.model.get('timespentSummary'));
                return App.DateFormatter.getDurationString(duration);
            },

            getCurrentTaskTime: function () {
                var taskDuration = moment.duration('0.0:00');

                this.collection.each(function (model) {
                    var duration = moment.duration(model.get('timeSpent'));
                    taskDuration.add(moment.duration(duration.hours(), 'hours'));
                    taskDuration.add(moment.duration(duration.minutes(), 'minutes'));
                });

                return App.DateFormatter.getDurationString(taskDuration);
            }
        });
    });
