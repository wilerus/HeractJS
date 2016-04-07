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

/* global define, _ */

define(['../../App', '../../templates/editors/numberEditor.html', './BaseEditorView'],
    function (App, template, EditorBaseView) {
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
            },

            focusElement: '.js-input',

            ui: {
                input: '.js-input'
            },

            className: '',

            template: Handlebars.compile(template, {noEscape: true}),

            mixinTemplateHelpers: function (data) {
                data = this.setPlaceholder(data);
                return data;
            },

            events: {
                'change @ui.input': '__change',
                'focus @ui.input': '__focus',
                'keypress @ui.input': '__keydown'
            },

            __focus: function(){
                this.ui.input.closest('div[data-editors]').removeClass('field-invalid');
            },

            __keyup: function () {
                if (this.options.changeMode === changeMode.keydown) {
                    var updateUi = false;
                    var value = this.ui.input.val();
                    if(!this.isValidNumber(value)){
                        value = 0;
                        updateUi = true;
                    }
                    this.__value(value, updateUi);
                }
            },

            __keydown: function (e) {
                if ((e.which !== 44 && e.which !== 46) && (e.which < 48 || e.which > 57)) {
                    e.preventDefault();
                }
            },

            __change: function () {
                var updateUi = false;
                var value = this.ui.input.val();
                if(!this.isValidNumber(value) && value !== ''){
                    value = 0;
                    updateUi = true;
                } else if(value === '') {
                    value = null;
                }
                this.__value(value, updateUi);
                this.showValidationNotifications();

            },

            setValue: function (value, silent) {
                var data;
                if(value){
                    if(value.data && value.data.length){
                        data = value.data[0].dataValue;
                    } else {
                        data = null;
                    }
                    if(!this.isValidNumber(data) && data !== null){
                        data = 0;
                    }
                    this.__value(data, true, silent);
                }
            },

            onRender: function () {
                var value = this.getValue();
                this.ui.input.val(value || '');
            },

            __value: function (value, updateUi, silent) {
                if(value !== "" && value !== null){
                    value = +value;
                }
                this.value.data = [{dataValue: value}];

                updateUi && this.updateUIValue(value);

                !silent && this.__triggerChange();
            },

            getValidationErrors: function (value) {
                this.validationErrors = [];
                value = +value;
                if(_.isNaN(value)){
                      this.validationErrors.push('isNaN');
                }
                if(this.key === 'percentComplete'){
                    if(value > 100){
                        this.validationErrors.push('percentError');
                    }
                    if(value < 0){
                        this.validationErrors.push('percentError');
                    }
                }
                return this.validationErrors;
            },

            isValidNumber: function(value){
                if(value === null){
                    return false;
                }
                value = +value;
                this.getValidationErrors(value);
                return (this.validationErrors.length == 0);
            },

            showValidationNotifications: function(){
                var errorsL = this.validationErrors.length;
                if(errorsL){
                    this.ui.input.closest('div[data-editors]').addClass('field-invalid');
                    for(var i = 0; i < errorsL; i++){
                        if(this.validationErrors[i] == 'percentError'){
                            App.NotificationsMediator.showWarning(App.Localizer.get('ELEGANCE.FORM.WIDGETS.FIELDS.NUMBER.GTLTPERIOD'));
                        }
                        if(this.validationErrors[i] == 'isNaN'){
                            App.NotificationsMediator.showWarning(App.Localizer.get('ELEGANCE.FORM.WIDGETS.FIELDS.NUMBER.WRONGSYMBLOS'));
                        }
                    }
                }
                this.validationErrors = [];
            }
        });
    });
