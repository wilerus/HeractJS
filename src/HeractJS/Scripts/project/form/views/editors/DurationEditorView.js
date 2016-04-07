/**
 * Developer: Stepan Burguchev
 * Date: 10/13/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, $, _, moment */

define(['../../App', '../../templates/editors/durationEditor.html', './BaseEditorView'],
    function (App, template, EditorBaseView) {
        'use strict';

        var defaultOptions = {
            changeMode: 'blur'
        };

        return EditorBaseView.extend({

            template: Handlebars.compile(template, {noEscape: true}),

            initialize: function (options) {
                _.extend(this.options, defaultOptions, _.pick(options || {}, _.keys(defaultOptions)));
                this.isMobileDevice = false;
                this.isDisplayedPlaceholderInput = !this.value.data || moment.duration(this.value.data[0].dataValue || '').asMilliseconds() == 0;
                if (this.value.isEmpty) {
                    this.isDisplayedPlaceholderInput = false;
                }
                this.setFormattedDuration(this.value.data ? this.value.data : '');
            },

            mixinTemplateHelpers: function (data) {
                data.inputType = this.isMobileDevice ? 'number' : 'text';
                data.isPlaceholder = this.isDisplayedPlaceholderInput;
                data.isEditable = this.isEditable;
                return data;
            },

            ui: {
                dayControl: '.js-day-input',
                dayInput: '.js-day-input input',
                hourControl: '.js-hour-input',
                hourInput: '.js-hour-input input',
                minuteControl: '.js-minute-input',
                minuteInput: '.js-minute-input input',
                placeholderInput: '.js-placeholder',
                dayText: '.js-days-text',
                hourText: '.js-hours-text',
                minuteText: '.js-minutes-texts',
                inputGroup: '.js-input-group'
            },

            className: '',

            events: {
                'blur input': '__change',
                'keyup input': '__onKeyUp',
                'keydown input': '__onKeydown',
                'click .js-input': '__onInputClick',
                'tap .js-input': '__onInputClick',
                'focus input': '__onInputFocus',
                'click @ui.placeholderInput': 'setDurationInput',
                'tap  @ui.placeholderInput': 'setDurationInput'
            },

            getHumanText: function (days, hours, minutes) {
                return {
                    daysText: App.Localizer.getTemplater('ELEGANCE.FORM.WIDGETS.FIELDS.DURATION.EDIT.DAYTEXT')({days: days ? days : 0}),
                    hoursText: App.Localizer.getTemplater('ELEGANCE.FORM.WIDGETS.FIELDS.DURATION.EDIT.HOURTEXT')({hours: hours ? hours : 0}),
                    minutesText: App.Localizer.getTemplater('ELEGANCE.FORM.WIDGETS.FIELDS.DURATION.EDIT.MINUTETEXT')({minutes: minutes ? minutes : 0})
                };
            },

            updateTexts: function () {
                var humanTexts = this.getHumanText(this.days, this.hours, this.minutes);

                this.ui.dayText.html(humanTexts.daysText);
                this.ui.hourText.html(humanTexts.hoursText);
                this.ui.minuteText.html(humanTexts.minutesText);
            },

            __onKeyUp: function (e) {
                this.setValueLengthAttribute($(e.target));
            },

            __onKeydown: function (e) {
                var code = e.keyCode || e.which;
                if (code == '9') {
                    this.disableBlurReaction = !$(e.target).parent().hasClass('js-minute-input');
                    this.__selectNextInput(e);
                } else if (code == '13') {
                    this.goToNextControl();
                }
            },

            setValueLengthAttribute: function (input) {
                var val = input.val(),
                    length = val ? val.length : 0;
                input.attr('data-length', length);
            },

            goToNextControl: function () {
                this.$el.parent().next().find('input, textarea').focus();
            },

            __selectNextInput: function (e) {
                clearTimeout(this.changeTimeout);
                if (this.__selectedInput === 'minute') {
                    return;
                }

                e.stopPropagation();
                e.preventDefault();

                var input;

                if (this.__selectedInput === 'day') {
                    input = this.ui.hourInput;
                } else if (this.__selectedInput === 'hour') {
                    input = this.ui.minuteInput;
                }

                this.__selectInput(input);
            },

            __onInputFocus: function (e) {
                if (!this.isEditable)
                    return;

                clearTimeout(this.changeTimeout);
                var input = $(e.target);
                this.__selectInput(input);
            },

            __onInputClick: function (e) {
                if (!this.isEditable)
                    return;

                clearTimeout(this.changeTimeout);
                var input;
                if (e.currentTarget.tagName.toLowerCase() === 'input') {
                    input = $(e.target);
                } else {
                    input = $(e.currentTarget).find('input');
                }
                this.__selectInput(input);
            },

            focus: function () {
                this.__selectInput(this.ui.dayInput);
            },

            __selectInput: function (input) {
                var val = input.val(),
                    maxLength = 0;

                maxLength = val ? val.length : maxLength;
                this.__setSelectedInput(input);
                input.select();
                try {
                    input[0].selectionEnd = 0;
                    input[0].selectionEnd = maxLength;
                } catch (e) {

                }
            },

            __setSelectedInput: function (input) {
                var inputParent = input.parent();
                if (inputParent.hasClass('js-day-input')) {
                    this.__selectedInput = 'day';
                } else if (inputParent.hasClass('js-hour-input')) {
                    this.__selectedInput = 'hour';
                } else if (inputParent.hasClass('js-minute-input')) {
                    this.__selectedInput = 'minute';
                }
            },

            __change: function () {
                this.getInputValue();
                delete this.__selectedInput;
                var isZero = moment.duration(this.isoValue).asMilliseconds() == 0;
                this.changeTimeout = setTimeout(function () {
                    !this.__selectedInput && this.changeBehaviour(isZero);
                }.bind(this), 100);
            },

            changeBehaviour: function (isZero) {
                this.__value(this.isoValue, false);
                if (!this.isDisplayedPlaceholderInput) {
                    if (!this.disableBlurReaction && isZero) {  // if 0d 0h 0m in duration
                        this.setPlaceholderInput();
                    }
                }
                this.disableBlurReaction = false;
            },

            getInputValue: function () {
                var days = this.ui.dayInput.val(),
                    hours = this.ui.hourInput.val(),
                    minutes = this.ui.minuteInput.val();

                this.days = parseInt(days, 10);
                this.hours = parseInt(hours, 10);
                this.minutes = parseInt(minutes, 10);

                this.validateValues();
                this.setIsoValue();
            },

            setIsoValue: function () {
                this.isoValue = 'P' + this.days + 'DT' + this.hours + 'H' + this.minutes + 'M';
            },


            validateValues: function () {
                if (isNaN(this.days)){
                    this.days = 0;
                }

                if (isNaN(this.hours)) {
                    this.hours = 0;
                }

                if (isNaN(this.minutes)) {
                    this.minutes = 0;
                }

                if (this.days > 999) {
                    this.days = 999;
                }

                if (this.hours > 23) {
                    this.hours = 23;
                }

                if (this.minutes > 59) {
                    this.minutes = 59;
                }

                this.setInputValue();
            },

            setDefaultValue: function () {
                this.days = this.hours = this.minutes = 0;
                this.setIsoValue();
                this.setInputValue();
            },

            setValue: function (value) {
                if (this.value.access !== 'Editable') {
                    this.ui.placeholderInput.attr('disabled', true);
                }
                if ((value.data === null || _.isEmpty(value.data) || moment.duration(value.data && value.data[0].dataValue || '').asMilliseconds() == 0) && this.isDisplayedPlaceholderInput) {
                    this.showPlaceholder();
                    this.isDisplayedPlaceholderInput = true;

                    if (this.value.access === 'Readonly' || this.value.access === 'Static') {
                        this.ui.placeholderInput.attr('placeholder', this.placeholders.readonly || "");
                    } else if (this.value.access === 'Hidden') {
                        this.ui.placeholderInput.attr('placeholder', this.placeholders.disabled || "");
                    } else if (this.value.prompt) {
                        var tmp = document.createElement("div");
                        tmp.innerHTML = value.prompt;
                        this.ui.placeholderInput.attr('placeholder', tmp.textContent || tmp.innerText || "");
                    } else if (value.data || moment.duration(value.data && value.data[0].dataValue || '').asMilliseconds() == 0) {
                        this.ui.placeholderInput.attr('placeholder', this.placeholders.empty);
                    }
                } else {
                    var data;

                    this.hidePlaceholder();
                    this.isDisplayedPlaceholderInput = false;

                    if (value) {
                        if (value.data && value.data.length) {
                            data = value.data[0].dataValue !== null ? value.data[0].dataValue : 'P0DT0H0M';
                        } else {
                            data = 'P0DT0H0M';
                        }

                        this.setFormattedDuration(data);

                        this.setInputValue();
                        this.focus();
                    }
                }

                this.setValueLengthAttribute(this.ui.dayInput);
                this.setValueLengthAttribute(this.ui.hourInput);
                this.setValueLengthAttribute(this.ui.minuteInput);
            },

            showPlaceholder: function () {
                this.ui.inputGroup.addClass('hidden');
                this.ui.placeholderInput.removeClass('hidden');
            },

            hidePlaceholder: function () {
                this.ui.placeholderInput.addClass('hidden');
                this.ui.inputGroup.removeClass('hidden');
            },

            setFormattedDuration: function (data) {
                this.isoValue = data;
                this.duration = data ? moment.duration(data) : null;
                this.days = this.duration ? this.duration._days : null; //don't use moment method days() cause it's returns (duration._days % 30)
                this.hours = this.duration ? this.duration.hours() : null;
                this.minutes = this.duration ? this.duration.minutes() : null;
            },

            setInputValue: function () {
                this.ui.dayInput.val(this.days);
                this.ui.hourInput.val(this.hours);
                this.ui.minuteInput.val(this.minutes);

                this.updateTexts();
            },

            __value: function (value, updateUi, silent) {
                if (this.value.data && this.value.data[0].dataValue === value) {
                    return;
                }
                if (value === '') {
                    value = null;
                }
                this.value.data = [{dataValue: value}];
                if (updateUi) {
                    this.$el.children('div').datetimepicker('update', value);
                }

                !silent && this.__triggerChange();
            },

            setDurationInput: function (e) {
                if (this.value.access !== 'Editable') {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }
                this.isDisplayedPlaceholderInput = false;
                this.render();
            },

            setPlaceholderInput: function () {
                this.isDisplayedPlaceholderInput = true;
                this.render();
            }
        });
    });
