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

/* global define, $, _, CKEDITOR */

define(['../../App', '../../templates/editors/textAreaEditor.html', './BaseEditorView'],
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
                this.setPlaceholder(this.value);
            },

            focusElement: '.js-input',

            ui: {
                input: '.js-input',
                placeholder: '.js-placeholder'
            },

            className: '',

            template: Handlebars.compile(template, {noEscape: true}),

            mixinTemplateHelpers: function (data) {

                var val = this.value.data;
                if (this.value.access !== 'Hidden' && val && val.length > 0) {
                    data.placeholder = val[0].dataValue;
                }
                data.isEditable = this.isEditable;

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
                var val = this.editor.getData();
                this.__value(val === '' ? null : val, false);
            },

            setValue: function (value, silent) {
                var data;
                if (value) {
                    if (value.data && value.data[0]) {
                        data = value.data[0].dataValue;
                    } else {
                        data = null;
                    }
                    this.__value(data, true, silent);
                }
            },

            showRichEditor: function () {
                var config = {
                    toolbar: 'Full',
                    baseFloatZIndex: 9999999,
                    language: App.currentParameters.language,
                    startupFocus: true,
                    extraPlugins: 'onchange',
                    toolbarStartupExpanded: false
                };

                if (this.value.type === 'MultiLineText') {
                    config.removePlugins = 'toolbar';
                }

                CKEDITOR.env.isCompatible = true;
                this.editor = CKEDITOR.replace(this.ui.input[0], config);

                var self = this;
                this.editor.on('instanceReady', function (e) {
                    this.__value(this.editor.getData(), false, true); // set equal initial editor & widget data
                    //hack for fullscreen scaling
                    var offsetFromTop = this.$el.find('iframe').offset().top;
                    var topElementPadding = parseInt($('.card__i').css('padding-top')) + 1;
                    var height = this.key === 'description' ? (Math.min(document.documentElement.clientHeight, window.innerHeight || 0) - offsetFromTop - topElementPadding + 'px') : 50;
                    this.$el.find('.cke_contents').css('height', height);
                     self.editor.on('change', function() {
                        self.__change();
                    });
                }.bind(this));
            },

            onRender: function () {
                var value = this.getValue();
                this.ui.input.val(value.data && value.data[0].dataValue || '');
                if ((value.type === 'HtmlText' || value.type === 'MultiLineText') && value.access === 'Editable') {
                    this.showRichEditor();
                }
            },

            updateUI: function (value) {
                this.isEditable ? this.ui.input.val(value) : this.ui.placeholder.html(value === null ? this.value.prompt : value);
                this.resolvePlaceholderClass();
            },

            resolvePlaceholderClass: function () {
                if (this.value.data && this.value.data[0] && this.value.data[0].dataValue) {
                    this.ui.placeholder.removeClass('placeholder');
                } else {
                    this.ui.placeholder.addClass('placeholder');
                }
            },

            __value: function (value, updateUi, silent) {
                if (this.value.data && (this.value.data[0].dataValue == value || this.value.data[0].dataValue === null && value === '')) {
                    return;
                }

                this.value.data = [{dataValue: value}];
                updateUi && this.updateUI(value);

                !silent && this.__triggerChange();
            }
        });
    });
