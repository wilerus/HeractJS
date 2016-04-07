/**
 * Developer: Grigory Kuznetsov
 * Date: 26/12/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, _ */

define(['../../App', '../../templates/editors/dateTimeEditorMobile.html', './BaseEditorView'],
    function (App, template, EditorBaseView) {
        'use strict';

        var defaultOptions = {
            changeMode: 'blur'
        };

        return EditorBaseView.extend({
            initialize: function (options) {
                _.extend(this.options, defaultOptions, _.pick(options || {}, _.keys(defaultOptions)));

                this.isMobileDevice = false
                this.isIOS = false;
                this.type = this.model.get(this.key).type;
                this.dateFormat = this.model.get([this.key]).dateFormat;
                this.isDateTime = this.type === 'DateTime';
                this.key = options.key;

                this.setInnerValueFromModel();
                this.setDisplayValue();
            },

            className: 'field',

            template: Handlebars.compile(template, {noEscape: true}),

            mixinTemplateHelpers: function (data) {
                data = this.setPlaceholder(data);
                data.dateDisplay = this.dateDisplay;
                data.timeDisplay = this.timeDisplay;
                data.isDateTime = this.isDateTime;
                return data;
            },

            ui: {
                dateDisplay: '.js-date-display',
                timeDisplay: '.js-time-display',
                dateInput: '.js-date-input',
                timeInput: '.js-time-input',
                removeButton: '.js-remove'
            },

            events: {
                'click @ui.removeButton': 'clearData'
            },

            blurInput: function (inputType, silent) {
                this.updateValue(inputType, silent);
            },

            setInputValue: function () {
                var value = this.innerValue !== null ? this.innerValue : new Date().toString();
                this.ui.dateInput.val(moment(value).format('YYYY-MM-DD'));
                this.ui.timeInput.val(moment(value).format('HH:mm:ss'));
            },

            clearData: function () {
                this.__value(null, true);
                this.hideRemoveButton();
            },

            updateValue: function (inputType, silent) {
                var dateValue = this.ui.dateInput.val(),
                    timeValue = this.ui.timeInput.val();

                if (dateValue === '' && inputType === 'dateInput' || timeValue === '' && inputType === 'timeInput') {
                    !silent && this.clearData();
                    return;
                }

                if (dateValue === '') {
                    dateValue = new Date();
                }

                var momentDate = moment(dateValue),
                    momentDuration = moment.duration(timeValue);

                momentDate
                    .add(momentDuration.hours(), 'h')
                    .add(momentDuration.minutes(), 'm')
                    .add(momentDuration.seconds(), 's');

                this.__value(momentDate.toISOString(), true, silent);
            },


            setValue: function (value, silent) {
                this.value = value;
                this.setInnerValueFromModel();
                this.updateDisplayValue();
            },

            updateDisplayValue: function (value) {
                this.setDisplayValue(value);

                if (this.isEditable || this.innerValue) {
                    !this.dateDisplay && this.setEmptyPlaceholder();
                    this.ui.dateDisplay.html(this.dateDisplay);
                    this.isDateTime && this.ui.timeDisplay.html(this.timeDisplay);
                    this.resolvePlaceholderClass();
                    this.hidePlaceholder();
                } else {
                    this.showPlaceholder();
                }
            },

            resolvePlaceholderClass: function () {
                if (this.innerValue) {
                    this.ui.dateDisplay.removeClass('placeholder');
                    this.isDateTime && this.ui.timeDisplay.removeClass('placeholder');
                } else {
                    this.ui.dateDisplay.addClass('placeholder');
                    this.isDateTime && this.ui.timeDisplay.addClass('placeholder');
                }
            },

            setDisplayValue: function (value) {
                var val = value || this.innerValue;
                if (val) {
                    if (this.isDateTime) {
                        var displayValues = App.DateFormatter.getMobileDateWithTrackerFormat(val, this.dateFormat, this.type);
                        this.dateDisplay = displayValues.date;
                        this.timeDisplay = displayValues.time;
                    } else {
                        this.dateDisplay = App.DateFormatter.getDateWithTrackerFormat(val, this.dateFormat, this.type);
                    }
                } else {
                    this.setEmptyPlaceholder();
                }
            },

            setEmptyPlaceholder: function () {
                if (this.isDateTime) {
                    this.dateDisplay = this.placeholders.dateEmpty;
                    this.timeDisplay = this.placeholders.timeEmpty;
                } else {
                    this.dateDisplay = this.placeholders.empty;
                }
            },

            setInnerValueFromModel: function () {
                if (this.value.data && this.value.data[0].dataValue) {
                    this.innerValue = this.value.data[0].dataValue;
                } else {
                    this.innerValue = null;
                }
            },

            initEventHandling: function () {
                this.$el.find('.js-date-input').on('change', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.blurInput('dateInput', this.isIOS);
                }.bind(this));

                this.$el.find('.js-time-input').on('change', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.blurInput('timeInput', this.isIOS);

                }.bind(this));

                if (this.isIOS) {
                    this.$el.find('.js-date-input').on('blur', function () {
                        this.blurInput('dateInput');
                    }.bind(this));

                    this.$el.find('.js-time-input').on('blur', function () {
                        this.blurInput('timeInput');
                    }.bind(this));
                }
            },

            onRender: function () {
                this.initEventHandling();
                this.showRemoveBtn();
            },

            showRemoveBtn: function () {
                if (this.innerValue !== null && !this.value.isMultivalue && this.isEditable) {
                    this.ui.removeButton.removeClass && this.ui.removeButton.removeClass('hidden');
                }
            },

            hideRemoveButton: function () {
                this.ui.removeButton.addClass && this.ui.removeButton.addClass('hidden');
            },

            __value: function (value, updateUi, silent) {
                if (moment(this.innerValue).isSame(moment(value))) {
                    return;
                }

                this.value.data = [{dataValue: value}];
                !silent && this.setInnerValueFromModel();
                if (updateUi) {
                    this.showRemoveBtn();
                    this.updateDisplayValue(value);
                }
                !silent && this.__triggerChange();
            },

            focus: function () {
                this.ui.dateDisplay.click();
            }
        });
    });
