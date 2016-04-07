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

/* global define, $, _ */

define(['../../App', '../../templates/editors/dateTimeEditor.html', './BaseEditorView'],
    function (App, template, EditorBaseView, moment) {
        'use strict';

        var changeMode = {
            blur: 'blur',
            keydown: 'keydown'
        };

        var defaultOptions = {
            changeMode: 'blur'
        };

        return EditorBaseView.extend({
            initialize: function (options) {
                _.extend(this.options, defaultOptions, _.pick(options || {}, _.keys(defaultOptions)));

                this.key = options.key;
                this.type = this.model.get(this.key).type;
                this.dateFormat = this.model.get([this.key]).dateFormat;
                this.setDisplayValue();
            },

            className: 'field',

            focusElement: '.js-input',

            ui: {
                input: '.js-input',
                editor: '.input-group',
                pickerEl: 'div.input-group',
                displayValueContainer: '.js-display-values',
                removeButton: '.js-remove',
                placeholder: '.js-placeholder'
            },

            template: Handlebars.compile(template, {noEscape: true}),

            mixinTemplateHelpers: function (data) {
                data = this.setPlaceholder(data);
                this.placeholder = data.prompt;
                data.displayValue = this.displayValue;
                return data;
            },

            events: {
                'keyup @ui.input': '__keyup',
                'click @ui.editor': 'showPicker',
                'click @ui.removeButton': '__clearData',
                'tap @ui.removeButton': '__clearData'
            },

            __keyup: function () {
                if (this.options.changeMode === changeMode.keydown) {
                    this.__value(this.ui.input.val(), false);
                }
            },

            __clearData: function () {
                this.__value(null, true);
                this.ui.removeButton.addClass('hidden');
            },

            showPicker: function () {
                if (!this.isEditable)
                    return;

                var mainRegionHeight = $('#main-region').height(),
                    pickerTopOffset = this.ui.pickerEl.offset().top,
                    isTopPosition = mainRegionHeight - pickerTopOffset < 250,
                    minView = this.type === 'DateTime' ? 0 : 2,
                    self = this;

                this.updatePickerDate();
                this.ui.pickerEl.datetimepicker({
                    autoclose: true,
                    minView: minView,
                    format: 'yyyy-mm-dd',
                    pickerPosition: isTopPosition ? 'top-right' : 'bottom-right',
                    language: App.DateFormatter.getLang(),
                    weekStart: App.DateFormatter.getWeekStartDay()
                }).on('changeDate', function (e) {
                    var newDate = new Date(e.date.setMinutes(e.date.getMinutes() + e.date.getTimezoneOffset()));
                    this.__value(newDate.toISOString(), true);
                    if (this.value.isMultivalue) {
                        this.bindUIElements();
                    }
                }.bind(this))
                    .on('hide', function () {
                        self.ui.pickerEl.off('changeDate');
                        self.ui.pickerEl.off('hide');
                        $(this).datetimepicker('remove');
                    });

                this.ui.pickerEl.datetimepicker('show');
            },

            setValue: function (value, silent) {
                var data;
                if (value) {
                    if (value.data && value.data.length) {
                        data = value.data[0].dataValue;
                    } else {
                        data = null;
                    }

                    this.dateFormat = value.dateFormat;
                    this.$el.children('div').attr('data-date-format', this.dateFormat);
                    var time;
                    var properties = value;
                    if (data !== null) {
                        time = new Date(data);
                        if (!isNaN(time.getTime())) {
                            this.__value(time, true, silent);
                        }
                    } else {
                        this.value.data = null;
                        this.updateDisplayValue();
                    }

                    if (properties.access !== 'Editable') {
                        this.ui.pickerEl.datetimepicker('remove');
                        this.ui.input.attr('disabled', true);
                    }
                }
            },

            updateDisplayValue: function () {
                this.setDisplayValue();
                this.ui.displayValueContainer.html(this.displayValue);
                this.updatePickerDate();
                this.resolvePlaceholderClass();
                this.showRemoveBtn();
            },

            updatePickerDate: function () {
                var format = 'YYYY-MM-DD',
                    formattedDate = this.value.data ? moment(new Date(this.value.data[0].dataValue)).format(format) : moment(new Date()).format(format);

                this.ui.input.val(formattedDate);
            },

            showRemoveBtn: function () {
                if (this.value.data && this.value.data[0] && this.value.data[0].dataValue && !this.value.isMultivalue && this.isEditable) {
                    this.ui.removeButton.removeClass('hidden');
                }
            },

            setDisplayValue: function () {
                if (this.value.data && this.value.data[0].dataValue) {
                    this.displayValue = App.DateFormatter.getDateWithTrackerFormat(this.value.data[0].dataValue, this.dateFormat, this.type);
                } else {
                    this.displayValue = this.placeholder;
                }
            },

            resolvePlaceholderClass: function () {
                if (this.value.data && this.value.data[0].dataValue) {
                    this.ui.displayValueContainer.removeClass('placeholder');
                } else {
                    this.ui.displayValueContainer.addClass('placeholder');
                }
            },

            onRender: function () {
                this.showRemoveBtn();
            },

            __value: function (value, updateUi, silent) {
                if (moment(this.value.data && this.value.data[0].dataValue).isSame(moment(value))) {
                    return;
                }

                this.value.data = [{dataValue: value}];
                if (updateUi) {
                    this.updateDisplayValue();
                }
                !silent && this.__triggerChange();
            },

            focus: function () {
                this.showPicker();
            }

        });
    });
