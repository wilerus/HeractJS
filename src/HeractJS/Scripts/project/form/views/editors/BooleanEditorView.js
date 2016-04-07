/**
 * Developer: Daniil Korolev
 * Date: 12/03/2015
 * Copyright: 2009-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, _ */

define(['../../App', '../../templates/editors/booleanEditor.html', './BaseEditorView'],
    function (App, template, EditorBaseView) {
        'use strict';

        var defaultOptions = {
            changeMode: 'blur'
        };

        return EditorBaseView.extend({
            initialize: function (options) {
                _.extend(this.options, defaultOptions, _.pick(options || {}, _.keys(defaultOptions)));
            },

            focusElement: '.js-input',

            ui: {
                checkbox: '.js-boolean_toggle',
                placeholder: '.js-placeholder'
            },

            template: Handlebars.compile(template),

            mixinTemplateHelpers: function (data) {
                this.setDisplayValue();
                data.displayValue = this.displayValue;
                if (this.getAccess() === 'Editable') {
                    data.isEditable = true;
                }
                var stateObject = this.getCheckedState();
                _.extend(data, stateObject);
                return data;
            },

            events: {
                'click @ui.checkbox': '__checkboxClicked'
            },

            __checkboxClicked: function() {
                this.__toggleValue();
                this.render();
            },

            __toggleValue: function() {
                var currentState = this.__getValue();
                if (currentState === true) {
                    this.__setValue(false);
                } else if (currentState === false) {
                    this.__setValue(true);
                } else {
                    this.__setValue(false)
                }
            },

            __getValue: function() {
                return this.value.data[0].dataValue;
            },

            setValue: function(value, silent) {
                !value.data && (value.data = [{dataValue: null}]); //hack for unset field on form update
                if (this.value.data[0].dataValue === value.data[0].dataValue)
                    return;

                this.__setValue(value.data[0].dataValue, silent);
            },

            __setValue: function(value, silent, updateUI) {
                this.value.data[0].dataValue = value;
                this.updateDisplayValue();
                !silent && this.__triggerChange();
            },

            updateDisplayValue: function () {
                if (!this.isEditable) {
                    this.setDisplayValue();
                    this.ui.placeholder.html(this.displayValue);
                    this.resolvePlaceholderClass();
                }
            },

            setDisplayValue: function () {
                var val = this.__getValue();
                if (val === true) {
                    this.displayValue =  App.Localizer.get('ELEGANCE.FORM.WIDGETS.BOOLEAN.TRUEVALUE');
                } else if (val === false) {
                    this.displayValue = App.Localizer.get('ELEGANCE.FORM.WIDGETS.BOOLEAN.FALSEVALUE');
                } else if (this.isEditable) {
                    this.displayValue = App.Localizer.get('ELEGANCE.FORM.WIDGETS.BOOLEAN.NOTSET');
                } else if (this.value.access === 'Hidden') {
                    this.displayValue = this.placeholders.disabled;
                } else {
                    this.displayValue = this.placeholders.readonly;
                }
            },

            resolvePlaceholderClass: function () {
                if (this.__getValue() !== null) {
                    this.ui.placeholder.removeClass('placeholder');
                } else {
                    this.ui.placeholder.addClass('placeholder');
                }
            },

            onRender: function () {
                this.resolvePlaceholderClass();
            },

            getAccess: function () {
                return this.value.access;
            },

            getCheckedState: function() {
                var stateObject;
                var data = this.__getValue();
                if (data === true) {
                    stateObject = {checkedState: true};
                } else if (data === false) {
                    stateObject = {uncheckedState: true};
                } else {
                    stateObject = {undefinedState: true};
                }
                return stateObject;
            }
        });
    });