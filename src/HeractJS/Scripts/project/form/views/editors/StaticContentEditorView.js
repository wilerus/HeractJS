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

define(['./BaseEditorView'],
    function (EditorBaseView) {
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
                input: '.js-content'
            },

            className: '',

            template: Handlebars.compile('<div class="js-content"></div>', {noEscape: true}),

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
                this.__value(this.ui.input.val(), false);
            },

            setValue: function (value, silent) {
                var data;
                if (value) {
                    if (value.data && value.data.length) {
                        data = value.data[0].dataValue;
                    } else {
                        data = null;
                    }
                    this.__value(data, true, silent);
                    if (value.access !== 'Editable') {
                        this.$el.find('input').attr('readonly', true);
                    }
                }
            },

            onRender: function () {
                var value = this.getValue();
                this.ui.input.html(value || '');
            },

            __value: function (value, updateUi, silent) {
                if (this.value === value) {
                    return;
                }
                this.value.data = [{dataValue: value}];
                if (updateUi) {
                    this.ui.input.val(value);
                }
                !silent && this.__triggerChange();
            },
            getValue: function () {
                return (this.value && this.value.data && this.value.data[0]) ? this.value.data[0].dataValue : '';
            }
        });
    });
