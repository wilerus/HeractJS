/**
 * Developer: Grigory Kuznetsov
 * Date: 10/11/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, _ */

define(['../../App', '../../templates/widgets/timespentItemNew.html'],
    function (App, TimespentItemNewTmpl) {
        'use strict';

        var timeSpentData = [
            {displayValue: '5m'}, {displayValue: '10m'}, {displayValue: '15m'},
            {displayValue: '30m'}, {displayValue: '45m'}, {displayValue: '1h'},
            {displayValue: '1h 30m'}, {displayValue: '2h'}, {displayValue: '2h 30m'},
            {displayValue: '3h'}, {displayValue: '4h'}, {displayValue: '5h'},
            {displayValue: '6h'}, {displayValue: '7h'}, {displayValue: '8h'}
        ];

        var getDuration = function (duration) {
            var h = duration.match(/^(\d+)h/i);
            var m = duration.match(/(\d+)m$/i);
            var hours = h ? parseInt(h[1]) : 0;
            var min = m ? parseInt(m[1]) : 0;

            var result = "PT";
            hours > 0 && (result += hours + "H");
            min > 0 && (result += min + "M");
            return result;
        };

        var TimeSpentItemNewView = Marionette.ItemView.extend({
            template: Handlebars.compile(TimespentItemNewTmpl, {noEscape: true}),
            className: 'card',
            mixinTemplateHelpers: function (data) {
                data.timeSpentData = this.timeSpentData;
                data.description = data.description ? this.replaceBRWithNewLine(data.description) : '';
                data.isMobileDevice = this.isMobileDevice;
                return data;
            },
            ui: {
                duration: 'select[name=duration]',
                description: '.js-description'
            },
            events: {
                'keyup @ui.description': 'setTextAreaHeight'
            },
            initialize: function (opts) {
                this.timeSpentData = _.clone(timeSpentData);
                _.each(this.timeSpentData, function (item) {
                    item.value = getDuration(item.displayValue);
                    var duration = moment.duration(item.value);
                    item.text = App.DateFormatter.getDurationString(duration);
                });

                this.addCurrentIfNeed();

                this.isMobileDevice = false
                this.isNew = opts.isNew;
                this.timespentModel = opts.timespentModel;

                if (this.isNew) {
                    this.listenTo(App.FormMediator, 'createNewTimespent', this.createNewTimespent.bind(this));
                } else {
                    this.listenTo(App.FormMediator, 'deleteTimespentItem', this.deleteTimespentItem.bind(this));
                    this.listenTo(App.FormMediator, 'tryBackToTimespentCollection', this.tryBackToTimespentCollection.bind(this));
                }
                App.reqres.setHandler('isTimespentEdited', function () {
                    return this.isDataChanged();
                }.bind(this));
            },
            addCurrentIfNeed: function () {
                if (!this.model) {
                    return;
                }

                var currentTimespent = this.model.get('timeSpent'),
                    isExist = _.findWhere(this.timeSpentData, {value: currentTimespent});

                if (!isExist) {
                    var item = {value: currentTimespent},
                        duration = moment.duration(currentTimespent);

                    item.text = App.DateFormatter.getDurationString(duration);
                    this.timeSpentData.push(item);
                }
            },
            tryBackToTimespentCollection: function () {
                if (this.isDataChanged()) {
                    App.FormMediator.showTimespentSaveDialog({model: this.model, data: this.currentData});
                } else {
                    App.FormMediator.showCurrentItemTimespent();
                }
            },

            minHeight: 20,
            maxHeight: 96,

            setTextAreaHeight: function () {
                var height = 0,
                    maxLines = 4,
                    minLines = 1,
                    descriptionVal = this.ui.description.val(),
                    matchesCnt = descriptionVal.match(/(?:\r\n|\r|\n)/g),
                    lineEndCnt = matchesCnt === null ? minLines : matchesCnt.length + 1;

                if (lineEndCnt > maxLines) {
                    lineEndCnt = maxLines;
                }

                height = this.minHeight * lineEndCnt;
                if (this.prevHeight !== height) {
                    this.ui.description.height(height + 'px');
                }

                this.prevHeight = height;
            },

            createNewTimespent: function () {
                this.getCurrentData();
                var recordDate = moment(this.currentData.date),
                    existingRecordModel = _.find(this.timespentModel.recordCollection.models, function (record) {
                        return recordDate.isSame(moment(record.date));
                    });

                if (existingRecordModel) {
                    this.addTimeToExistingRecord(existingRecordModel);
                } else {
                    var newTimeSpentModel = new this.timespentModel.recordCollection.model(this.currentData);
                    newTimeSpentModel.create();
                }
            },

            addTimeToExistingRecord: function (existingRecordModel) {
                var timespent = moment.duration(existingRecordModel.get('timeSpent'));
                timespent.add(moment.duration(this.currentData.timeSpent));
                existingRecordModel.set({timeSpent: timespent.toISOString()});
                existingRecordModel.edit();
            },

            deleteTimespentItem: function () {
                this.model.delete();
            },
            isDataChanged: function () {
                this.getCurrentData();
                var cDate = this.currentData.date,
                    newDate = new Date(cDate.setMinutes(cDate.getMinutes() - cDate.getTimezoneOffset()));
                return !this.model || !moment(this.model.get('date')).isSame(moment(newDate)) ||
                    this.model.get('description') !== this.currentData.description ||
                    this.model.get('timeSpent') !== this.currentData.timeSpent;
            },
            getCurrentData: function () {
                this.currentData = this.getData();
            },
            createItem: function () {
                var newModel = new this.collection.model(this.getData());
                newModel.create();
            },
            editItem: function () {
                this.model.set(this.getData());
                this.model.edit();
            },
            getData: function () {
                return {
                    'timeSpent': this.ui.duration.val(),
                    'description': this.getDescription(),
                    'date': this.getDate()
                };
            },
            getDate: function () {
                var date;
                if (this.isMobileDevice) {
                    date = new Date(this.dateInput.val());
                } else {
                    date = this.date.datetimepicker('getDate');
                }

                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);

                return date;
            },
            getDescription: function () {
                var inputValue = this.ui.description.val();
                return inputValue.replace(/(?:\r\n|\r|\n)/g, '<br/>');
            },

            replaceBRWithNewLine: function (str) {
                return str.replace(/<br\s*\/?>/mg, '\n');
            },

            onRender: function () {
                if (this.model) {
                    this.ui.duration.find('option[value="' + this.model.get('timeSpent') + '"]').attr('selected', 'selected');
                }

                this.initDatepicker();
            },

            initDatepicker: function () {
                if (this.isMobileDevice) {
                    this.initMobilePicker();
                } else {
                    this.initDesktopPicker();
                }
            },

            initMobilePicker: function () {
                this.dateDisplay = this.$el.find('.js-date-display');
                this.dateInput = this.$el.find('.js-date-input');

                var date = this.model ? new Date(this.model.get('date')) : new Date();
                this.setDisplayDate(date);
                this.dateInput.val(moment(date).format('YYYY-MM-DD'));

                this.dateInput.change(function () {
                    var date = this.dateInput.val();

                    if (date === '') {
                        date = new Date().toISOString();
                    }

                    this.setDisplayDate(date);
                }.bind(this));
            },

            initDesktopPicker: function () {
                this.date = this.$el.find('.js-date');
                this.dateDisplay = this.$el.find('.js-date-display');
                this.dateInput = this.$el.find('.js-date-input');

                var date = this.model ? new Date(this.model.get('date')) : new Date();
                this.setDisplayDate(date);

                this.date.datetimepicker({
                    autoclose: true,
                    minView: 'year',
                    language: App.DateFormatter.getLang(),
                    weekStart: App.DateFormatter.getWeekStartDay()
                });

                this.date.datetimepicker('update', date);

                this.dateDisplay.click(function () {
                    this.date.datetimepicker('show');
                }.bind(this));

                this.date.change(function () {
                    var date = this.getDate();

                    this.setDisplayDate(date);
                }.bind(this));
            },

            setDisplayDate: function (date) {
                this.dateDisplay.html(App.DateFormatter.getDateWithTrackerFormat(date));
            },

            onShow: function () {
                this.setTextAreaHeight();
            },

            tryNavigateToDataset: function () {
                var isChanged = this.isDataChanged();
                App.FormMediator.isEdittedInfoReturn(isChanged);
            }
        });

        return TimeSpentItemNewView;
    });
