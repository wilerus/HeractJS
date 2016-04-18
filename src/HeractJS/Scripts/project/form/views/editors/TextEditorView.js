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

define(['form/templates/editors/textEditor.html', './BaseEditorView'],
    function (template, EditorBaseView) {
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
                'keyup @ui.input': '__keyup',
                'change @ui.input': '__change'
            },

            __keyup: function () {
                if (this.options.changeMode === changeMode.keydown) {
                    this.__value(this.ui.input.val(), false);
                }
            },

            __change: function () {
                var val = this.ui.input.val();
                this.__value(val === '' ? null : val, false);
            },

            setValue: function (value, silent) {
                var data;
                if(value){
                    if(value.data && value.data.length) {
                        data = value.data[0].dataValue;
                    } else {
                        data = null;
                    }
                    this.__value(data, true, silent);
                }

            },

            onRender: function () {
                var value = this.getValue();
                this.ui.input.val(value.dataValue || '');
            },

            __value: function (value, updateUi, silent) {
                if (this.value === value) {
                    return;
                }
                this.value.data = [{dataValue: value}];

                updateUi && this.updateUIValue(value);
                !silent && this.__triggerChange();
            }
        });
    });
